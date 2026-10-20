export const PORTFOLIO_PAGE_SIZE = 11;

/** Each page contains four large cards, three compact cards, then four large cards. */
export const getPortfolioPlacement = (index: number) => {
  const position = index % PORTFOLIO_PAGE_SIZE;
  return { page: Math.floor(index / PORTFOLIO_PAGE_SIZE), compact: position >= 4 && position < 7 };
};
