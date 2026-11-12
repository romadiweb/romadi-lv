type Profile = { first_name: string; last_name: string; photo: string | null };

async function resizePhoto(file: File): Promise<string> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 10_000_000) {
    throw new Error('Izvēlies JPG, PNG vai WebP attēlu līdz 10 MB.');
  }
  const image = await createImageBitmap(file);
  try {
    const size = Math.min(image.width, image.height);
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 192;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Foto neizdevās sagatavot.');
    ctx.fillStyle = '#21151c';
    ctx.fillRect(0, 0, 192, 192);
    ctx.drawImage(
      image,
      (image.width - size) / 2,
      (image.height - size) / 2,
      size,
      size,
      0,
      0,
      192,
      192,
    );
    return canvas.toDataURL('image/jpeg', 0.82);
  } finally {
    image.close();
  }
}

export function initProfileEditor(
  root: HTMLElement,
  request: <T>(url: string, options?: RequestInit) => Promise<T>,
  onChange: () => void,
) {
  const dialog = root.querySelector<HTMLDialogElement>('[data-profile-dialog]')!;
  const form = dialog.querySelector<HTMLFormElement>('[data-profile-form]')!;
  const status = form.querySelector<HTMLElement>('[data-profile-status]')!;
  const first = form.elements.namedItem('first_name') as HTMLInputElement;
  const last = form.elements.namedItem('last_name') as HTMLInputElement;
  const file = form.elements.namedItem('photo') as HTMLInputElement;
  const submit = form.querySelector<HTMLButtonElement>('[type="submit"]')!;
  let profile: Profile | null = null;

  const render = () => {
    if (!profile) return;
    root.querySelector('[data-profile-name]')!.textContent =
      profile.first_name + ' ' + profile.last_name;
    const avatar = root.querySelector<HTMLElement>('[data-profile-avatar]')!;
    avatar.textContent = profile.first_name.slice(0, 1).toLocaleUpperCase('lv');
    if (profile.photo) {
      const img = document.createElement('img');
      img.alt = '';
      img.src = profile.photo;
      avatar.replaceChildren(img);
    }
    onChange();
  };
  const load = request<{ data: Profile | null }>('/api/portal/profile')
    .then(({ data }) => {
      profile = data;
      render();
    })
    .catch(() => {
      status.textContent = 'Profilu neizdevās ielādēt.';
    });

  root.querySelector('[data-profile-open]')?.addEventListener('click', async () => {
    await load;
    if (dialog.open) return;
    first.value = profile?.first_name ?? '';
    last.value = profile?.last_name ?? '';
    file.value = '';
    dialog.showModal();
  });
  dialog.querySelector('[data-profile-close]')?.addEventListener('click', () => dialog.close());
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submit.disabled) return;
    submit.disabled = true;
    status.textContent = 'Saglabā…';
    try {
      const photo = file.files?.[0] ? await resizePhoto(file.files[0]) : undefined;
      const result = await request<{ data: Profile }>('/api/portal/profile', {
        method: 'PATCH',
        body: JSON.stringify({ first_name: first.value, last_name: last.value, photo }),
      });
      profile = result.data;
      render();
      status.textContent = '';
      dialog.close();
    } catch (error) {
      status.textContent = error instanceof Error ? error.message : 'Profilu neizdevās saglabāt.';
    } finally {
      submit.disabled = false;
    }
  });

  return { firstName: () => profile?.first_name };
}
