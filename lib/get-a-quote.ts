export const QUOTE_ATTACHMENT_MAX_BYTES = 2 * 1024 * 1024;
export const QUOTE_ATTACHMENT_ACCEPT = '.pdf,.doc,.docx,.jpg,.jpeg,.png';
export const QUOTE_ATTACHMENT_HELP_TEXT = 'Optional attachment: PDF, Word, JPG, or PNG up to 2MB.';

const allowedAttachmentMimeTypes = new Set([
  'application/msword',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
]);

const allowedAttachmentExtensions = new Set([
  '.doc',
  '.docx',
  '.jpeg',
  '.jpg',
  '.pdf',
  '.png',
]);

type AttachmentValidationResult =
  | { file: File | null; error: null }
  | { file: null; error: string };

function getFileExtension(fileName: string) {
  const lastDotIndex = fileName.lastIndexOf('.');

  if (lastDotIndex === -1) {
    return '';
  }

  return fileName.slice(lastDotIndex).toLowerCase();
}

export function validateQuoteAttachment(
  value: FormDataEntryValue | null
): AttachmentValidationResult {
  if (!(value instanceof File)) {
    return { file: null, error: null };
  }

  if (!value.name && value.size === 0) {
    return { file: null, error: null };
  }

  if (value.size > QUOTE_ATTACHMENT_MAX_BYTES) {
    return {
      file: null,
      error: 'Attachment must be 2MB or smaller.',
    };
  }

  const mimeType = value.type.toLowerCase();
  const extension = getFileExtension(value.name);
  const isAllowedMimeType = mimeType ? allowedAttachmentMimeTypes.has(mimeType) : false;
  const isAllowedExtension = allowedAttachmentExtensions.has(extension);

  if (!isAllowedMimeType && !isAllowedExtension) {
    return {
      file: null,
      error: 'Attachment must be a PDF, Word document, JPG, or PNG file.',
    };
  }

  return { file: value, error: null };
}
