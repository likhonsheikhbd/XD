"use client"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useChatSettings } from "@/hooks/use-chat-settings"

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { settings, updateSettings, resetSettings } = useChatSettings()

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Chat Settings</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Model Selection */}
          <div className="space-y-2">
            <Label>AI Model</Label>
            <Select
              value={settings.model || "auto"}
              onValueChange={(value) => updateSettings({ model: value === "auto" ? undefined : value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto-select</SelectItem>
                <SelectItem value="gemini-2.0-flash-thinking-exp">Gemini 2.0 Flash (Thinking)</SelectItem>
                <SelectItem value="gemini-1.5-pro-latest">Gemini 1.5 Pro</SelectItem>
                <SelectItem value="gemini-1.5-flash-latest">Gemini 1.5 Flash</SelectItem>
                <SelectItem value="gemini-1.5-flash-8b-latest">Gemini 1.5 Flash 8B</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Generation Parameters */}
          <div className="space-y-4">
            <h3 className="font-medium">Generation Parameters</h3>

            <div className="space-y-2">
              <Label>Temperature: {settings.temperature?.toFixed(1) || "0.7"}</Label>
              <Slider
                value={[settings.temperature || 0.7]}
                onValueChange={([value]) => updateSettings({ temperature: value })}
                max={1}
                min={0}
                step={0.1}
              />
            </div>

            <div className="space-y-2">
              <Label>Top P: {settings.topP?.toFixed(1) || "0.9"}</Label>
              <Slider
                value={[settings.topP || 0.9]}
                onValueChange={([value]) => updateSettings({ topP: value })}
                max={1}
                min={0}
                step={0.1}
              />
            </div>

            <div className="space-y-2">
              <Label>Max Tokens: {settings.maxTokens || 2048}</Label>
              <Slider
                value={[settings.maxTokens || 2048]}
                onValueChange={([value]) => updateSettings({ maxTokens: value })}
                max={4096}
                min={256}
                step={256}
              />
            </div>
          </div>

          <Separator />

          {/* Features */}
          <div className="space-y-4">
            <h3 className="font-medium">Features</h3>

            <div className="flex items-center justify-between">
              <Label>Search Grounding</Label>
              <Switch
                checked={settings.useSearchGrounding || false}
                onCheckedChange={(checked) => updateSettings({ useSearchGrounding: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Auto Translation</Label>
              <Switch
                checked={settings.autoTranslate || false}
                onCheckedChange={(checked) => updateSettings({ autoTranslate: checked })}
              />
            </div>

            {settings.autoTranslate && (
              <div className="space-y-2">
                <Label>Target Language</Label>
                <Select
                  value={settings.targetLanguage || "en"}
                  onValueChange={(value) => updateSettings({ targetLanguage: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="it">Italian</SelectItem>
                    <SelectItem value="pt">Portuguese</SelectItem>
                    <SelectItem value="ru">Russian</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                    <SelectItem value="ko">Korean</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex items-center justify-between">
              <Label>Sentiment Analysis</Label>
              <Switch
                checked={settings.enableSentiment || true}
                onCheckedChange={(checked) => updateSettings({ enableSentiment: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Content Moderation</Label>
              <Switch
                checked={settings.enableModeration || true}
                onCheckedChange={(checked) => updateSettings({ enableModeration: checked })}
              />
            </div>
          </div>

          <Separator />

          {/* Safety Settings */}
          <div className="space-y-4">
            <h3 className="font-medium">Safety Settings</h3>

            <div className="space-y-2">
              <Label>Safety Level</Label>
              <Select
                value={settings.safetyLevel || "medium"}
                onValueChange={(value) => updateSettings({ safetyLevel: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="strict">Strict</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="space-y-2">
            <Button onClick={resetSettings} variant="outline" className="w-full">
              Reset to Defaults
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
