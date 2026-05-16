import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as apiModule from '@/lib/api';
import { MessageFeedback } from '@/components/MessageFeedback';

const OK = { id: 'abc', success: true };

describe('MessageFeedback', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('renders thumbs up and thumbs down buttons', () => {
    render(<MessageFeedback conversationId={1} />);
    expect(screen.getByRole('button', { name: 'Helpful' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Not helpful' })).toBeInTheDocument();
  });

  it('opens down-vote popover with specific questions on thumbs down', async () => {
    render(<MessageFeedback conversationId={1} />);
    await userEvent.click(screen.getByRole('button', { name: 'Not helpful' }));
    expect(screen.getByText('What was the problem?')).toBeInTheDocument();
    expect(screen.getByText('The ruling conclusion was wrong')).toBeInTheDocument();
    expect(screen.getByText('CR rule numbers cited were inaccurate')).toBeInTheDocument();
    expect(screen.getByText('Relevant CR rules were not mentioned')).toBeInTheDocument();
    expect(screen.getByText('Did not answer the actual question asked')).toBeInTheDocument();
    expect(screen.getByText('Hard to understand or apply at the table')).toBeInTheDocument();
  });

  it('does not show card relevance question when no cards prop', async () => {
    render(<MessageFeedback conversationId={1} />);
    await userEvent.click(screen.getByRole('button', { name: 'Not helpful' }));
    expect(screen.queryByText('Example cards were not relevant to this scenario')).toBeNull();
  });

  it('shows card relevance question and chip ratings when cards are provided', async () => {
    render(<MessageFeedback conversationId={1} cards={['Sol Ring', 'Brainstorm']} />);
    await userEvent.click(screen.getByRole('button', { name: 'Not helpful' }));
    expect(screen.getByText('Example cards were not relevant to this scenario')).toBeInTheDocument();
    expect(screen.getByText('Rate each example card')).toBeInTheDocument();
    expect(screen.getByText('Sol Ring')).toBeInTheDocument();
    expect(screen.getByText('Brainstorm')).toBeInTheDocument();
  });

  it('opens up-vote popover on thumbs up', async () => {
    render(<MessageFeedback conversationId={1} />);
    await userEvent.click(screen.getByRole('button', { name: 'Helpful' }));
    expect(screen.getByText('What was helpful? (optional)')).toBeInTheDocument();
  });

  it('shows card ratings section in up-vote popover when cards provided', async () => {
    render(<MessageFeedback conversationId={1} cards={['Sol Ring']} />);
    await userEvent.click(screen.getByRole('button', { name: 'Helpful' }));
    expect(screen.getByText('Were these example cards relevant?')).toBeInTheDocument();
  });

  it('submits correct payload on down-vote with checkboxes ticked', async () => {
    const spy = vi.spyOn(apiModule.rulesApi, 'submitMessageFeedback').mockResolvedValue(OK as never);
    render(<MessageFeedback conversationId={1} messageId={5} messageSnippet="test" />);
    await userEvent.click(screen.getByRole('button', { name: 'Not helpful' }));
    await userEvent.click(screen.getByLabelText('The ruling conclusion was wrong'));
    await userEvent.click(screen.getByLabelText('CR rule numbers cited were inaccurate'));
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => expect(spy).toHaveBeenCalled());
    const payload = spy.mock.calls[0][0];
    expect(payload.rating).toBe('down');
    expect(payload.wrong_conclusion).toBe(true);
    expect(payload.wrong_cr_cite).toBe(true);
    expect(payload.missing_cr_rules).toBeUndefined();
    expect(payload.conversation_id).toBe(1);
    expect(payload.message_id).toBe(5);
  });

  it('submits card_feedback when a card is cycled to bad', async () => {
    const spy = vi.spyOn(apiModule.rulesApi, 'submitMessageFeedback').mockResolvedValue(OK as never);
    render(<MessageFeedback conversationId={1} cards={['Sol Ring']} />);
    await userEvent.click(screen.getByRole('button', { name: 'Not helpful' }));
    // Cycle chip: null → good → not_relevant → bad (3 clicks)
    const chip = screen.getByRole('button', { name: /sol ring/i });
    await userEvent.click(chip); // good
    await userEvent.click(chip); // not_relevant
    await userEvent.click(chip); // bad
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => expect(spy).toHaveBeenCalled());
    expect(spy.mock.calls[0][0].card_feedback).toEqual({ 'Sol Ring': 'bad' });
  });

  it('omits card_feedback from payload when no cards rated', async () => {
    const spy = vi.spyOn(apiModule.rulesApi, 'submitMessageFeedback').mockResolvedValue(OK as never);
    render(<MessageFeedback conversationId={1} cards={['Sol Ring']} />);
    await userEvent.click(screen.getByRole('button', { name: 'Not helpful' }));
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => expect(spy).toHaveBeenCalled());
    expect(spy.mock.calls[0][0].card_feedback).toBeUndefined();
  });

  it('shows submitted state after successful submission', async () => {
    vi.spyOn(apiModule.rulesApi, 'submitMessageFeedback').mockResolvedValue(OK as never);
    render(<MessageFeedback conversationId={1} />);
    await userEvent.click(screen.getByRole('button', { name: 'Helpful' }));
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    // thumbs buttons replaced by the submitted checkmark+icon state
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Helpful' })).toBeNull());
    expect(screen.queryByRole('button', { name: 'Not helpful' })).toBeNull();
  });

  it('shows submitted state even if API call fails', async () => {
    vi.spyOn(apiModule.rulesApi, 'submitMessageFeedback').mockRejectedValue(new Error('Network error'));
    render(<MessageFeedback conversationId={1} />);
    await userEvent.click(screen.getByRole('button', { name: 'Not helpful' }));
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Not helpful' })).toBeNull());
  });

  it('flag for pattern review toggle is present in down-vote form', async () => {
    render(<MessageFeedback conversationId={1} />);
    await userEvent.click(screen.getByRole('button', { name: 'Not helpful' }));
    expect(screen.getByText('Flag for pattern review')).toBeInTheDocument();
  });
});
