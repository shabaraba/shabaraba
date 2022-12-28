import type { IFileFile, IExternalFile, IEmoji } from './NotionApiResponses'

export type IPageHead = {
  id: string
  title: string
  tags?: IPageTag[]
  icon?: IPageIcon
  cover?: IPageCover
  slug?: string
  publishedAt: string
  updatedAt?: string

  [prop: string]: any
}

export type IPageTag = {
  id: number;
  color: string;
  name: string;
  iconLabel?: string
  iconName?: any
  [prop: string]: any;
}

export type IPageIcon = IEmoji & {
  type: 'emoji'
}

export type IPageCover = IFileFile & IExternalFile

