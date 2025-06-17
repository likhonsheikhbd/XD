"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, AlertTriangle, CheckCircle, XCircle, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  validateSecurity,
  validateLPG8C,
  generateSecurityReport,
  type SecurityValidationResult,
  type LPG8CFramework,
} from "@/lib/security-validation"

interface SecurityPanelProps {
  code: string
  className?: string
}

export function SecurityPanel({ code, className }: SecurityPanelProps) {
  const [validation, setValidation] = useState<SecurityValidationResult | null>(null)
  const [lpg8c, setLpg8c] = useState<LPG8CFramework | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    if (code) {
      analyzeCode()
    }
  }, [code])

  const analyzeCode = async () => {
    setIsAnalyzing(true)

    // Simulate analysis delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const securityValidation = validateSecurity(code)
    const lpg8cValidation = validateLPG8C(code)

    setValidation(securityValidation)
    setLpg8c(lpg8cValidation)
    setIsAnalyzing(false)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-600"
      case "medium":
        return "text-yellow-600"
      case "high":
        return "text-orange-600"
      case "critical":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case "low":
        return "default"
      case "medium":
        return "secondary"
      case "high":
        return "destructive"
      case "critical":
        return "destructive"
      default:
        return "outline"
    }
  }

  const calculateComplianceScore = (lpg8c: LPG8CFramework): number => {
    const controls = [
      lpg8c.inputValidation,
      lpg8c.outputEncoding,
      lpg8c.authentication,
      lpg8c.authorization,
      lpg8c.rateLimiting,
      lpg8c.caching,
      lpg8c.logging,
      lpg8c.monitoring,
      lpg8c.auditTrail,
    ]

    const principles = Object.values(lpg8c.principles)
    const allChecks = [...controls, ...principles]

    return Math.round((allChecks.filter(Boolean).length / allChecks.length) * 100)
  }

  const downloadReport = () => {
    if (!validation || !lpg8c) return

    const report = generateSecurityReport(validation, lpg8c)
    const blob = new Blob([report], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "security-report.md"
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isAnalyzing) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-y-4">
            <div className="text-center">
              <Shield className="w-12 h-12 mx-auto mb-4 animate-pulse" />
              <p className="text-lg font-medium">Analyzing Security...</p>
              <p className="text-sm text-muted-foreground">Running LPG8C validation</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!validation || !lpg8c) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-6">
          <div className="text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No Code to Analyze</p>
            <p className="text-sm text-muted-foreground">Provide code to run security validation</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const complianceScore = calculateComplianceScore(lpg8c)

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <CardTitle>Security Analysis</CardTitle>
            <Badge variant={getRiskBadgeVariant(validation.riskLevel)}>{validation.riskLevel.toUpperCase()}</Badge>
          </div>

          <Button variant="outline" size="sm" onClick={downloadReport}>
            <Download className="w-4 h-4 mr-1" />
            Report
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="violations">Violations</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="recommendations">Fixes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={cn("w-5 h-5", getRiskColor(validation.riskLevel))} />
                    <div>
                      <p className="text-sm font-medium">Risk Level</p>
                      <p className={cn("text-lg font-bold", getRiskColor(validation.riskLevel))}>
                        {validation.riskLevel.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Compliance Score</p>
                      <p className="text-lg font-bold text-blue-600">{complianceScore}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">LPG8C Compliance</span>
                <span className="text-sm text-muted-foreground">{complianceScore}%</span>
              </div>
              <Progress value={complianceScore} className="h-2" />
            </div>
          </TabsContent>

          <TabsContent value="violations" className="space-y-4">
            {validation.violations.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-600" />
                <p className="text-lg font-medium">No Security Violations Found</p>
                <p className="text-sm text-muted-foreground">Your code passed all security checks</p>
              </div>
            ) : (
              <div className="space-y-3">
                {validation.violations.map((violation, index) => (
                  <Card key={index} className="border-l-4 border-l-destructive">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <XCircle className="w-4 h-4 text-destructive" />
                            <span className="font-medium">{violation.type}</span>
                            <Badge variant={getRiskBadgeVariant(violation.severity)} size="sm">
                              {violation.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{violation.message}</p>
                          {violation.line && (
                            <p className="text-xs text-muted-foreground">
                              Line {violation.line}, Column {violation.column}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="compliance" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-3">Security Controls</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: "inputValidation", label: "Input Validation" },
                    { key: "outputEncoding", label: "Output Encoding" },
                    { key: "authentication", label: "Authentication" },
                    { key: "authorization", label: "Authorization" },
                    { key: "rateLimiting", label: "Rate Limiting" },
                    { key: "caching", label: "Caching" },
                    { key: "logging", label: "Logging" },
                    { key: "monitoring", label: "Monitoring" },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-2 text-sm">
                      {lpg8c[key as keyof LPG8CFramework] ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Security Principles</h4>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(lpg8c.principles).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 text-sm">
                      {value ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span>{key.replace(/([A-Z])/g, " $1").toLowerCase()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            {validation.recommendations.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-600" />
                <p className="text-lg font-medium">No Recommendations</p>
                <p className="text-sm text-muted-foreground">Your code follows security best practices</p>
              </div>
            ) : (
              <div className="space-y-3">
                {validation.recommendations.map((recommendation, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-medium text-blue-600 dark:text-blue-400">{index + 1}</span>
                        </div>
                        <p className="text-sm">{recommendation}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
