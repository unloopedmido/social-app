import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function timeAgo(date: Date) {
	const now = new Date();
	const diff = now.getTime() - date.getTime();
	const seconds = Math.floor(diff / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	const weeks = Math.floor(days / 7);
	const months = Math.floor(days / 30);

	if (months > 0) {
		return `${months}mo ago`;
	}

	if (weeks > 0) {
		return `${weeks}w ago`;
	}

	if (days > 0) {
		return `${days}d ago`;
	}

	if (hours > 0) {
		return `${hours}h ago`;
	}

	if (minutes > 0) {
		return `${minutes}m ago`;
	}

	return `${seconds}s ago`;
}

export function extractUsernameFromEmail(email: string) {
	return email.split("@")[0];
}