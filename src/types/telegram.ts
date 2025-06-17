export interface TelegramWebApp {
  initData: string
  initDataUnsafe: {
    user?: TelegramUser
    chat?: TelegramChat
    start_param?: string
  }
  version: string
  platform: string
  colorScheme: "light" | "dark"
  themeParams: TelegramThemeParams
  isExpanded: boolean
  viewportHeight: number
  viewportStableHeight: number
  headerColor: string
  backgroundColor: string
  BackButton: TelegramBackButton
  MainButton: TelegramMainButton
  HapticFeedback: TelegramHapticFeedback
  CloudStorage: TelegramCloudStorage
  BiometricManager: TelegramBiometricManager
  ready: () => void
  expand: () => void
  close: () => void
  sendData: (data: string) => void
  openLink: (url: string) => void
  openTelegramLink: (url: string) => void
  openInvoice: (url: string, callback?: (status: string) => void) => void
  showPopup: (params: TelegramPopupParams, callback?: (buttonId: string) => void) => void
  showAlert: (message: string, callback?: () => void) => void
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void
  showScanQrPopup: (params: TelegramScanQrParams, callback?: (text: string) => void) => void
  closeScanQrPopup: () => void
  readTextFromClipboard: (callback?: (text: string) => void) => void
  requestWriteAccess: (callback?: (granted: boolean) => void) => void
  requestContact: (callback?: (granted: boolean) => void) => void
  onEvent: (eventType: string, eventHandler: () => void) => void
  offEvent: (eventType: string, eventHandler: () => void) => void
}

export interface TelegramUser {
  id: number
  is_bot?: boolean
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
  added_to_attachment_menu?: boolean
  allows_write_to_pm?: boolean
  photo_url?: string
}

export interface TelegramChat {
  id: number
  type: "group" | "supergroup" | "channel"
  title: string
  username?: string
  photo_url?: string
}

export interface TelegramThemeParams {
  bg_color?: string
  text_color?: string
  hint_color?: string
  link_color?: string
  button_color?: string
  button_text_color?: string
  secondary_bg_color?: string
}

export interface TelegramMainButton {
  text: string
  color: string
  textColor: string
  isVisible: boolean
  isActive: boolean
  isProgressVisible: boolean
  setText: (text: string) => void
  onClick: (callback: () => void) => void
  offClick: (callback: () => void) => void
  show: () => void
  hide: () => void
  enable: () => void
  disable: () => void
  showProgress: (leaveActive?: boolean) => void
  hideProgress: () => void
  setParams: (params: {
    text?: string
    color?: string
    text_color?: string
    is_active?: boolean
    is_visible?: boolean
  }) => void
}

export interface TelegramBackButton {
  isVisible: boolean
  onClick: (callback: () => void) => void
  offClick: (callback: () => void) => void
  show: () => void
  hide: () => void
}

export interface TelegramHapticFeedback {
  impactOccurred: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void
  notificationOccurred: (type: "error" | "success" | "warning") => void
  selectionChanged: () => void
}

export interface TelegramCloudStorage {
  setItem: (key: string, value: string, callback?: (error: string | null, result?: boolean) => void) => void
  getItem: (key: string, callback?: (error: string | null, result?: string) => void) => void
  getItems: (keys: string[], callback?: (error: string | null, result?: Record<string, string>) => void) => void
  removeItem: (key: string, callback?: (error: string | null, result?: boolean) => void) => void
  removeItems: (keys: string[], callback?: (error: string | null, result?: boolean) => void) => void
  getKeys: (callback?: (error: string | null, result?: string[]) => void) => void
}

export interface TelegramBiometricManager {
  isInited: boolean
  isBiometricAvailable: boolean
  biometricType: "finger" | "face" | "unknown"
  isAccessRequested: boolean
  isAccessGranted: boolean
  isBiometricTokenSaved: boolean
  deviceId: string
  init: (callback?: () => void) => void
  requestAccess: (params: { reason?: string }, callback?: (granted: boolean) => void) => void
  authenticate: (params: { reason?: string }, callback?: (success: boolean, token?: string) => void) => void
  updateBiometricToken: (token: string, callback?: (updated: boolean) => void) => void
  openSettings: () => void
}

export interface TelegramPopupParams {
  title?: string
  message: string
  buttons?: Array<{
    id?: string
    type?: "default" | "ok" | "close" | "cancel" | "destructive"
    text?: string
  }>
}

export interface TelegramScanQrParams {
  text?: string
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp
    }
  }
}
