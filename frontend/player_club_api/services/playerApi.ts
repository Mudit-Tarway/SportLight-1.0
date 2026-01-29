
import { API_BASE_URL } from "../config/api";

// PLAYER AUTH
export const signupPlayer = (data: any) =>
  fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const loginPlayer = (data: any) =>
  fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

// PLAYER PROFILE
export const getPlayerMe = (token: string) =>
  fetch(`${API_BASE_URL}/api/player/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const updatePlayerMe = (token: string, data: any) =>
  fetch(`${API_BASE_URL}/api/player/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

export const deletePlayerMe = (token: string) =>
  fetch(`${API_BASE_URL}/api/player/me`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
