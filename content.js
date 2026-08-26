"use strict";

// YouTube is a SPA: applying on load is not enough. Re-run on in-app navigation.
const POLL_MS = 250;
const MAX_ATTEMPTS = 48; // ~12s for player/chat to appear

let pollTimer = null;
let activeVideoId = null;

function isWatchPage() {
  return location.pathname === "/watch" && new URLSearchParams(location.search).has("v");
}

function getVideoId() {
  return new URLSearchParams(location.search).get("v");
}

function getWatchFlexy() {
  return document.querySelector("ytd-watch-flexy");
}

function isTheaterOn(flexy) {
  return (
    flexy.hasAttribute("theater") ||
    flexy.hasAttribute("full-bleed-player")
  );
}

function enableTheaterMode() {
  const flexy = getWatchFlexy();
  if (!flexy) return false;
  if (flexy.hasAttribute("fullscreen")) return true;
  if (isTheaterOn(flexy)) return true;

  const sizeButton = document.querySelector("button.ytp-size-button");
  if (!sizeButton) return false;

  sizeButton.click();
  return isTheaterOn(flexy);
}

function getLiveChat() {
  return document.querySelector("ytd-live-chat-frame#chat, ytd-live-chat-frame, #chat");
}

function isLiveVideo() {
  const flexy = getWatchFlexy();
  if (flexy?.hasAttribute("is-live-video")) return true;
  if (document.querySelector(".ytp-live-badge:not([disabled])")) return true;
  if (getLiveChat()) return true;
  return false;
}

function collapseLiveChat() {
  const chat = getLiveChat();
  if (!chat) return false;
  if (chat.hasAttribute("collapsed") || chat.collapsed === true) return true;

  const hideButton =
    document.querySelector("#show-hide-button button") ||
    document.querySelector('#show-hide-button [id="button"]') ||
    document.querySelector(
      'button[aria-label*="Hide chat" i], button[aria-label*="Ocultar chat" i], button[aria-label*="Ocultar o chat" i]'
    );

  if (!hideButton) return false;

  hideButton.click();
  return chat.hasAttribute("collapsed") || chat.collapsed === true;
}

function applyForCurrentVideo() {
  if (!isWatchPage()) return true;

  const theaterDone = enableTheaterMode();

  let chatDone = false;
  if (isLiveVideo()) {
    chatDone = collapseLiveChat();
  } else if (getWatchFlexy()?.querySelector("video.html5-main-video, video")) {
    // Player is up and this is not a live page — no chat to close.
    chatDone = true;
  }

  return theaterDone && chatDone;
}

function startApplying() {
  if (pollTimer !== null) {
    clearInterval(pollTimer);
    pollTimer = null;
  }

  if (!isWatchPage()) {
    activeVideoId = null;
    return;
  }

  const videoId = getVideoId();
  activeVideoId = videoId;

  let attempts = 0;
  pollTimer = setInterval(() => {
    if (getVideoId() !== activeVideoId) {
      clearInterval(pollTimer);
      pollTimer = null;
      return;
    }

    attempts += 1;
    if (applyForCurrentVideo() || attempts >= MAX_ATTEMPTS) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
  }, POLL_MS);
}

window.addEventListener("yt-navigate-finish", startApplying);
startApplying();
