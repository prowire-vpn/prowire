import {BrowserWindow} from 'electron';

export function handleUrl(url: string) {
  const urlObj = new URL(url);

  switch (urlObj.host + urlObj.pathname) {
    case 'auth/redirect': {
      handleAuthRedirect(url);
      break;
    }
    default:
      console.warn('Unknown path:', urlObj.pathname);
  }
}

function handleAuthRedirect(url: string) {
  BrowserWindow.getAllWindows().forEach((window) => {
    if (window.title === 'Prowire') {
      window.webContents.send('auth-redirect', url);
      window.focus();
    } else {
      window.close();
    }
  });
}
