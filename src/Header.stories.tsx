import type { Meta, StoryObj } from '@storybook/react';
import Header from './Header';

const meta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    alwaysVisible: {
      control: 'boolean',
      description: 'Whether the header should always be visible or show/hide on scroll',
    },
    title: {
      control: 'text',
      description: 'The title text displayed in the header',
    },
    titleHref: {
      control: 'text',
      description: 'The link destination for the title',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the header',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    alwaysVisible: true,
  },
};

export const WithCustomTitle: Story = {
  args: {
    alwaysVisible: true,
    title: 'My Custom Site',
    titleHref: '/custom',
  },
};

export const ScrollBehavior: Story = {
  args: {
    alwaysVisible: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'This header will show/hide based on scroll position. Scroll down to see the effect.',
      },
    },
  },
};

export const CustomNavigation: Story = {
  args: {
    alwaysVisible: true,
    navigationItems: [
      { label: 'Home', href: '/' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/contact' },
      { label: 'GitHub', href: 'https://github.com', external: true },
    ],
  },
};

export const WithTallHeight: Story = {
  args: {
    alwaysVisible: true,
    title: 'Tall Header Demo',
  },
  parameters: {
    docs: {
      description: {
        story: 'This story demonstrates the new taller header height (h-20 instead of h-16).',
      },
    },
  },
};