export interface NotionPostHead {
  id: string
  title: string
  tags?: NotionTag[]
  icon?: NotionIcon
  cover?: string
  slug?: string
  createdAt: string
  updatedAt?: string

  [prop: string]: any
}

export interface NotionTag {
  id: number;
  color: string;
  name: string;
  iconLabel?: string
  iconName?: any
  [prop: string]: any;
}

export interface NotionIcon {
  type: string;
  emoji: string;
}
