
import { API_BASE_URL } from "../config/api";

// CLUB / RECRUITER AUTH
export const signupClub = (data: any) =>
  fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const loginClub = (data: any) =>
  fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

// CLUB PROFILE
export const getAllClubs = () =>
  fetch(`${API_BASE_URL}/api/club`, {
    method: "GET",
  });

export const getMyClub = (token: string) =>
  fetch(`${API_BASE_URL}/api/club/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const updateMyClub = (token: string, data: any) =>
  fetch(`${API_BASE_URL}/api/club/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
