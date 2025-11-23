import { Page } from '@playwright/test';

export async function waitForYouTubePlayer(page: Page, timeout: number = 15000) {
  await page.waitForFunction(
    () => {
      return (window as any).YT && (window as any).YT.Player;
    },
    { timeout }
  );
}

export async function getYouTubePlayerState(page: Page): Promise<number> {
  return await page.evaluate(() => {
    const player = (window as any).player;
    return player ? player.getPlayerState() : -1;
  });
}

export async function isYouTubePlaying(page: Page): Promise<boolean> {
  const state = await getYouTubePlayerState(page);
  return state === 1; // YT.PlayerState.PLAYING = 1
}

export async function getVideoCurrentTime(page: Page): Promise<number> {
  return await page.evaluate(() => {
    // Try YouTube player first
    const ytPlayer = (window as any).player;
    if (ytPlayer) {
      return ytPlayer.getCurrentTime();
    }

    // Fallback to HTML5 video
    const video = document.querySelector('video') as HTMLVideoElement;
    return video ? video.currentTime : 0;
  });
}

export async function getVideoDuration(page: Page): Promise<number> {
  return await page.evaluate(() => {
    // Try YouTube player first
    const ytPlayer = (window as any).player;
    if (ytPlayer) {
      return ytPlayer.getDuration();
    }

    // Fallback to HTML5 video
    const video = document.querySelector('video') as HTMLVideoElement;
    return video ? video.duration : 0;
  });
}

export async function seekVideo(page: Page, seconds: number) {
  await page.evaluate((seconds) => {
    // Try YouTube player first
    const ytPlayer = (window as any).player;
    if (ytPlayer) {
      ytPlayer.seekTo(seconds);
      return;
    }

    // Fallback to HTML5 video
    const video = document.querySelector('video') as HTMLVideoElement;
    if (video) {
      video.currentTime = seconds;
    }
  }, seconds);
}

export async function playVideo(page: Page) {
  await page.evaluate(() => {
    // Try YouTube player first
    const ytPlayer = (window as any).player;
    if (ytPlayer) {
      ytPlayer.playVideo();
      return;
    }

    // Fallback to HTML5 video
    const video = document.querySelector('video') as HTMLVideoElement;
    if (video) {
      video.play();
    }
  });
}

export async function pauseVideo(page: Page) {
  await page.evaluate(() => {
    // Try YouTube player first
    const ytPlayer = (window as any).player;
    if (ytPlayer) {
      ytPlayer.pauseVideo();
      return;
    }

    // Fallback to HTML5 video
    const video = document.querySelector('video') as HTMLVideoElement;
    if (video) {
      video.pause();
    }
  });
}

export async function watchVideoUntilProgress(page: Page, progressPercentage: number) {
  const duration = await getVideoDuration(page);
  const targetTime = (duration * progressPercentage) / 100;

  await seekVideo(page, Math.max(0, targetTime - 5));
  await playVideo(page);

  // Wait for video to reach target time
  await page.waitForFunction(
    ({ targetTime }) => {
      const ytPlayer = (window as any).player;
      if (ytPlayer) {
        return ytPlayer.getCurrentTime() >= targetTime;
      }

      const video = document.querySelector('video') as HTMLVideoElement;
      return video ? video.currentTime >= targetTime : false;
    },
    { targetTime },
    { timeout: 30000 }
  );

  await pauseVideo(page);
}

export async function calculateProgress(currentTime: number, duration: number): Promise<number> {
  if (duration === 0) return 0;
  return Math.min(100, (currentTime / duration) * 100);
}
