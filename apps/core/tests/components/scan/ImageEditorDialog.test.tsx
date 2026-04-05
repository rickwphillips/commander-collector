import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ImageEditorDialog } from '@/decks/scan/components/ImageEditorDialog';
import type { ImageEditorState } from '@/decks/scan/components/ImageEditorDialog';

const defaultState: ImageEditorState = {
  rotation: 0,
  brightness: 100,
  contrast: 100,
  zoom: 1,
  panX: 0,
  panY: 0,
};

describe('ImageEditorDialog', () => {
  const defaultProps = {
    open: true,
    previewUrl: 'https://example.com/photo.jpg',
    state: defaultState,
    onStateChange: () => {},
    onSubmit: () => {},
    onClose: () => {},
    onReupload: () => {},
  };

  it('does not render content when closed', () => {
    render(<ImageEditorDialog {...defaultProps} open={false} />);
    expect(screen.queryByText('Adjust Image Before Scanning')).not.toBeInTheDocument();
  });

  it('renders title when open', () => {
    render(<ImageEditorDialog {...defaultProps} />);
    expect(screen.getByText('Adjust Image Before Scanning')).toBeInTheDocument();
  });

  it('shows preview image', () => {
    render(<ImageEditorDialog {...defaultProps} />);
    const img = screen.getByAltText('Preview');
    expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg');
  });

  it('shows rotation controls', () => {
    render(<ImageEditorDialog {...defaultProps} />);
    expect(screen.getByText('Rotation')).toBeInTheDocument();
    expect(screen.getByText('0°')).toBeInTheDocument();
  });

  it('calls onStateChange when rotation button is clicked', async () => {
    const user = userEvent.setup();
    const onStateChange = vi.fn();
    render(<ImageEditorDialog {...defaultProps} onStateChange={onStateChange} />);
    // Find rotation buttons — there are two (left and right)
    const rotateButtons = screen.getByText('Rotation').closest('[class*="Stack"]')!.querySelectorAll('button');
    // Click right rotate (second button)
    await user.click(rotateButtons[1]);
    expect(onStateChange).toHaveBeenCalledWith({ rotation: 90 });
  });

  it('calls onSubmit when Submit is clicked', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ImageEditorDialog {...defaultProps} onSubmit={onSubmit} />);
    await user.click(screen.getByText('Submit'));
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it('calls onClose when Cancel is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<ImageEditorDialog {...defaultProps} onClose={onClose} />);
    await user.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onReupload when Reupload is clicked', async () => {
    const user = userEvent.setup();
    const onReupload = vi.fn();
    render(<ImageEditorDialog {...defaultProps} onReupload={onReupload} />);
    await user.click(screen.getByText('Reupload'));
    expect(onReupload).toHaveBeenCalledOnce();
  });

  it('shows Retake button when onRetake is provided', () => {
    render(<ImageEditorDialog {...defaultProps} onRetake={() => {}} />);
    expect(screen.getByText('Retake')).toBeInTheDocument();
  });

  it('hides Retake button when onRetake is not provided', () => {
    render(<ImageEditorDialog {...defaultProps} />);
    expect(screen.queryByText('Retake')).not.toBeInTheDocument();
  });

  it('shows brightness and contrast controls', () => {
    render(<ImageEditorDialog {...defaultProps} />);
    expect(screen.getByText('Brightness')).toBeInTheDocument();
    expect(screen.getByText('Contrast')).toBeInTheDocument();
  });

  it('shows zoom control', () => {
    render(<ImageEditorDialog {...defaultProps} />);
    expect(screen.getByText('Zoom')).toBeInTheDocument();
  });
});
