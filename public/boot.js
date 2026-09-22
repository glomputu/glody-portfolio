(() => {
  const root = document.documentElement;
  const storedTheme = localStorage.getItem('glodi-theme');
  const theme = storedTheme === 'light' || storedTheme === 'dark'
    ? storedTheme
    : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const storedLanguage = localStorage.getItem('glodi-language');
  root.dataset.theme = theme;
  root.classList.toggle('dark', theme === 'dark');
  root.lang = storedLanguage === 'en' ? 'en' : 'fr';
  root.style.colorScheme = theme;
})();
