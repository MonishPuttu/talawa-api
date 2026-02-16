import { z } from "zod";

<<<<<<< HEAD
=======
export const mimeTypeMapping = {
	IMAGE_AVIF: "image/avif",
	IMAGE_JPEG: "image/jpeg",
	IMAGE_PNG: "image/png",
	IMAGE_WEBP: "image/webp",
	VIDEO_MP4: "video/mp4",
	VIDEO_WEBM: "video/webm",
} as const;

>>>>>>> upstream
export const postAttachmentMimeTypeEnum = z.enum([
	"image/avif",
	"image/jpeg",
	"image/png",
	"image/webp",
	"video/mp4",
	"video/webm",
<<<<<<< HEAD
	"video/quicktime",
=======
>>>>>>> upstream
]);
