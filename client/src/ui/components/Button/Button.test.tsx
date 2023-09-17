import {faker} from '@faker-js/faker';
import * as React from 'react';
import {Button} from './Button';
import {render, screen, fireEvent} from 'test/utils';

describe('Button', () => {
  let text: string;

  beforeEach(() => {
    text = faker.lorem.word();
  });

  it('should display given text', async () => {
    console.log('A');
    render(<Button text={text} />);
    console.log('B');
    await screen.findByText(text);
  });

  it('should call the given onPress callback when pressed', async () => {
    const onPress = jest.fn();
    render(<Button text={text} onPress={onPress} />);

    await screen.findByText(text);
    fireEvent.press(screen.getByText(text));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should not call the given onPress callback when pressed and button is disabled', async () => {
    const onPress = jest.fn();
    render(<Button text={text} disabled onPress={onPress} />);

    await screen.findByText(text);
    fireEvent.press(screen.getByText(text));
    expect(onPress).not.toHaveBeenCalled();
  });
});
