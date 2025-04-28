import React from 'react';
import { render, screen } from '@testing-library/react';
import NotionBlockRenderer from '../../../../../themes/theme2/components/blog/NotionBlockRenderer';

// 必要なモジュールをモック
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img 
      src={props.src} 
      alt={props.alt} 
      width={props.width} 
      height={props.height}
      style={{ objectFit: props.objectFit }}
      data-testid="next-image"
    />;
  },
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, className, target, rel }: any) => {
    return (
      <a href={href} className={className} target={target} rel={rel} data-testid="next-link">
        {children}
      </a>
    );
  },
}));

describe('NotionBlockRenderer', () => {
  it('should render nothing when blocks array is empty', () => {
    const { container } = render(<NotionBlockRenderer blocks={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render a paragraph block', () => {
    const blocks = [
      {
        id: 'block1',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            { 
              plain_text: 'This is a paragraph', 
              annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false } 
            }
          ]
        }
      }
    ];

    render(<NotionBlockRenderer blocks={blocks} />);
    expect(screen.getByText('This is a paragraph')).toBeInTheDocument();
  });

  // ===== 以下、サポートされていないブロックタイプのテスト =====

  it('should display a fallback for unsupported block type', () => {
    const blocks = [
      {
        id: 'unsupported1',
        type: 'unsupported', // サポートされていないブロックタイプ
        unsupported: { /* サポートされていないブロックのデータ */ }
      }
    ];

    render(<NotionBlockRenderer blocks={blocks} />);
    expect(screen.getByText('Unsupported block type: unsupported')).toBeInTheDocument();
  });

  it('should display a fallback for embed block type', () => {
    const blocks = [
      {
        id: 'embed1',
        type: 'embed', // 埋め込みブロック
        embed: {
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      }
    ];

    render(<NotionBlockRenderer blocks={blocks} />);
    expect(screen.getByText('Unsupported block type: embed')).toBeInTheDocument();
  });

  it('should display a fallback for bookmark block type', () => {
    const blocks = [
      {
        id: 'bookmark1',
        type: 'bookmark', // ブックマークブロック
        bookmark: {
          url: 'https://www.example.com',
          caption: []
        }
      }
    ];

    render(<NotionBlockRenderer blocks={blocks} />);
    expect(screen.getByText('Unsupported block type: bookmark')).toBeInTheDocument();
  });

  it('should display a fallback for toggle block type', () => {
    const blocks = [
      {
        id: 'toggle1',
        type: 'toggle', // トグルブロック
        toggle: {
          rich_text: [{ plain_text: 'Toggle content', annotations: {} }],
          children: {
            results: [
              {
                id: 'toggle_child1',
                type: 'paragraph',
                paragraph: {
                  rich_text: [{ plain_text: 'Toggle child content', annotations: {} }]
                }
              }
            ]
          }
        }
      }
    ];

    render(<NotionBlockRenderer blocks={blocks} />);
    expect(screen.getByText('Unsupported block type: toggle')).toBeInTheDocument();
  });

  // ===== 将来の実装のためのより詳細なテストケース =====

  // 将来的に embed ブロックを実装する場合を想定したテスト
  it.skip('should render an embed block correctly when implemented', () => {
    const blocks = [
      {
        id: 'embed1',
        type: 'embed',
        embed: {
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          caption: [{ plain_text: 'YouTube video', annotations: {} }]
        }
      }
    ];

    render(<NotionBlockRenderer blocks={blocks} />);
    // 実装後に期待される要素
    const iframe = screen.getByTestId('embed-iframe');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', 'https://www.youtube.com/embed/dQw4w9WgXcQ');
  });

  // 将来的に bookmark ブロックを実装する場合を想定したテスト
  it.skip('should render a bookmark block correctly when implemented', () => {
    const blocks = [
      {
        id: 'bookmark1',
        type: 'bookmark',
        bookmark: {
          url: 'https://www.example.com',
          caption: [{ plain_text: 'Example website', annotations: {} }],
          title: 'Example Website',
          description: 'This is an example website for testing purposes'
        }
      }
    ];

    render(<NotionBlockRenderer blocks={blocks} />);
    // 実装後に期待される要素
    expect(screen.getByText('Example Website')).toBeInTheDocument();
    expect(screen.getByText('This is an example website for testing purposes')).toBeInTheDocument();
    expect(screen.getByText('Example website')).toBeInTheDocument();
    const link = screen.getByTestId('bookmark-link');
    expect(link).toHaveAttribute('href', 'https://www.example.com');
  });

  // 将来的に toggle ブロックを実装する場合を想定したテスト
  it.skip('should render a toggle block correctly when implemented', () => {
    const blocks = [
      {
        id: 'toggle1',
        type: 'toggle',
        toggle: {
          rich_text: [{ plain_text: 'Toggle header', annotations: {} }],
          children: {
            results: [
              {
                id: 'toggle_child1',
                type: 'paragraph',
                paragraph: {
                  rich_text: [{ plain_text: 'Toggle content', annotations: {} }]
                }
              }
            ]
          }
        }
      }
    ];

    render(<NotionBlockRenderer blocks={blocks} />);
    // 実装後に期待される要素
    expect(screen.getByText('Toggle header')).toBeInTheDocument();
    // 初期状態では内容が非表示
    expect(screen.queryByText('Toggle content')).not.toBeInTheDocument();
    
    // クリックアクションをシミュレートして内容を表示
    const toggleButton = screen.getByTestId('toggle-button');
    toggleButton.click();
    
    // クリック後は内容が表示される
    expect(screen.getByText('Toggle content')).toBeInTheDocument();
  });
});
