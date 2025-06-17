export interface SecurityValidationResult {
  isValid: boolean
  violations: SecurityViolation[]
  riskLevel: "low" | "medium" | "high" | "critical"
  recommendations: string[]
}

export interface SecurityViolation {
  type: string
  severity: "low" | "medium" | "high" | "critical"
  message: string
  line?: number
  column?: number
}

export interface LPG8CFramework {
  // Layered Protection
  inputValidation: boolean
  outputEncoding: boolean
  authentication: boolean
  authorization: boolean

  // Performance & Security
  rateLimiting: boolean
  caching: boolean
  compression: boolean

  // Governance & Compliance
  logging: boolean
  monitoring: boolean
  auditTrail: boolean

  // 8 Core Principles
  principles: {
    defenseInDepth: boolean
    failSecure: boolean
    leastPrivilege: boolean
    separationOfDuties: boolean
    economyOfMechanism: boolean
    completeMediation: boolean
    openDesign: boolean
    psychologicalAcceptability: boolean
  }
}

const SECURITY_PATTERNS = {
  xss: {
    patterns: [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe[^>]*>/gi,
      /eval\s*\(/gi,
      /innerHTML\s*=/gi,
    ],
    severity: "high" as const,
    message: "Potential XSS vulnerability detected",
  },

  sqlInjection: {
    patterns: [
      /'\s*(or|and)\s*'?\d/gi,
      /union\s+select/gi,
      /drop\s+table/gi,
      /delete\s+from/gi,
      /insert\s+into/gi,
      /update\s+\w+\s+set/gi,
    ],
    severity: "critical" as const,
    message: "Potential SQL injection vulnerability detected",
  },

  pathTraversal: {
    patterns: [
      /\.\.\//g,
      /\.\.\\\/g,
      /%2e%2e%2f / gi,
      /%2e%2e%5c/gi,
    ],
    severity: "high" as const,
    message: "Potential path traversal vulnerability detected",
  },

  hardcodedSecrets: {
    patterns: [
      /password\s*=\s*["'][^"']+["']/gi,
      /api[_-]?key\s*=\s*["'][^"']+["']/gi,
      /secret\s*=\s*["'][^"']+["']/gi,
      /token\s*=\s*["'][^"']+["']/gi,
      /private[_-]?key\s*=\s*["'][^"']+["']/gi,
    ],
    severity: "critical" as const,
    message: "Hardcoded secrets detected",
  },

  insecureRandom: {
    patterns: [/Math\.random$$$$/gi, /new\s+Date$$$$\.getTime$$$$/gi],
    severity: "medium" as const,
    message: "Insecure random number generation detected",
  },

  unsafeEval: {
    patterns: [
      /eval\s*\(/gi,
      /Function\s*\(/gi,
      /setTimeout\s*\(\s*["'][^"']*["']/gi,
      /setInterval\s*\(\s*["'][^"']*["']/gi,
    ],
    severity: "high" as const,
    message: "Unsafe code execution detected",
  },
}

export function validateSecurity(code: string): SecurityValidationResult {
  const violations: SecurityViolation[] = []

  // Check for security patterns
  Object.entries(SECURITY_PATTERNS).forEach(([type, config]) => {
    config.patterns.forEach((pattern) => {
      const matches = Array.from(code.matchAll(pattern))
      matches.forEach((match) => {
        violations.push({
          type,
          severity: config.severity,
          message: config.message,
          line: getLineNumber(code, match.index || 0),
          column: getColumnNumber(code, match.index || 0),
        })
      })
    })
  })

  // Determine risk level
  const riskLevel = calculateRiskLevel(violations)

  // Generate recommendations
  const recommendations = generateRecommendations(violations)

  return {
    isValid: violations.length === 0,
    violations,
    riskLevel,
    recommendations,
  }
}

export function validateLPG8C(code: string): LPG8CFramework {
  const hasInputValidation = /validate|sanitize|escape/gi.test(code)
  const hasOutputEncoding = /encode|escape|sanitize/gi.test(code)
  const hasAuthentication = /auth|login|session|jwt|token/gi.test(code)
  const hasAuthorization = /authorize|permission|role|access/gi.test(code)
  const hasRateLimiting = /rate.?limit|throttle/gi.test(code)
  const hasCaching = /cache|redis|memcache/gi.test(code)
  const hasCompression = /compress|gzip|deflate/gi.test(code)
  const hasLogging = /log|audit|track/gi.test(code)
  const hasMonitoring = /monitor|metric|alert/gi.test(code)
  const hasAuditTrail = /audit|trail|history/gi.test(code)

  return {
    inputValidation: hasInputValidation,
    outputEncoding: hasOutputEncoding,
    authentication: hasAuthentication,
    authorization: hasAuthorization,
    rateLimiting: hasRateLimiting,
    caching: hasCaching,
    compression: hasCompression,
    logging: hasLogging,
    monitoring: hasMonitoring,
    auditTrail: hasAuditTrail,
    principles: {
      defenseInDepth: hasInputValidation && hasOutputEncoding && hasAuthentication,
      failSecure: /try.?catch|error.?handling/gi.test(code),
      leastPrivilege: hasAuthorization,
      separationOfDuties: /role|permission/gi.test(code),
      economyOfMechanism: !/complex|complicated/gi.test(code),
      completeMediation: hasAuthentication && hasAuthorization,
      openDesign: /\/\*|\/\/|comment/gi.test(code),
      psychologicalAcceptability: /user.?friendly|intuitive/gi.test(code),
    },
  }
}

function getLineNumber(code: string, index: number): number {
  return code.substring(0, index).split("\n").length
}

function getColumnNumber(code: string, index: number): number {
  const lines = code.substring(0, index).split("\n")
  return lines[lines.length - 1].length + 1
}

function calculateRiskLevel(violations: SecurityViolation[]): "low" | "medium" | "high" | "critical" {
  if (violations.some((v) => v.severity === "critical")) return "critical"
  if (violations.some((v) => v.severity === "high")) return "high"
  if (violations.some((v) => v.severity === "medium")) return "medium"
  return "low"
}

function generateRecommendations(violations: SecurityViolation[]): string[] {
  const recommendations: string[] = []

  const violationTypes = [...new Set(violations.map((v) => v.type))]

  violationTypes.forEach((type) => {
    switch (type) {
      case "xss":
        recommendations.push("Use proper output encoding and Content Security Policy (CSP)")
        recommendations.push("Sanitize user inputs and avoid innerHTML")
        break
      case "sqlInjection":
        recommendations.push("Use parameterized queries or prepared statements")
        recommendations.push("Implement input validation and sanitization")
        break
      case "pathTraversal":
        recommendations.push("Validate and sanitize file paths")
        recommendations.push("Use allowlists for permitted file operations")
        break
      case "hardcodedSecrets":
        recommendations.push("Use environment variables for sensitive data")
        recommendations.push("Implement proper secrets management")
        break
      case "insecureRandom":
        recommendations.push("Use cryptographically secure random number generators")
        recommendations.push("Consider using crypto.randomBytes() or crypto.getRandomValues()")
        break
      case "unsafeEval":
        recommendations.push("Avoid dynamic code execution")
        recommendations.push("Use safer alternatives like JSON.parse() for data parsing")
        break
    }
  })

  return [...new Set(recommendations)]
}

export function generateSecurityReport(validation: SecurityValidationResult, lpg8c: LPG8CFramework): string {
  let report = "# Security Validation Report\n\n"

  report += `## Overall Risk Level: ${validation.riskLevel.toUpperCase()}\n\n`

  if (validation.violations.length > 0) {
    report += `## Security Violations (${validation.violations.length})\n\n`
    validation.violations.forEach((violation, index) => {
      report += `### ${index + 1}. ${violation.type} (${violation.severity})\n`
      report += `- **Message**: ${violation.message}\n`
      if (violation.line) {
        report += `- **Location**: Line ${violation.line}, Column ${violation.column}\n`
      }
      report += "\n"
    })
  }

  if (validation.recommendations.length > 0) {
    report += "## Recommendations\n\n"
    validation.recommendations.forEach((rec, index) => {
      report += `${index + 1}. ${rec}\n`
    })
    report += "\n"
  }

  report += "## LPG8C Framework Compliance\n\n"
  report += "### Security Controls\n"
  report += `- Input Validation: ${lpg8c.inputValidation ? "✅" : "❌"}\n`
  report += `- Output Encoding: ${lpg8c.outputEncoding ? "✅" : "❌"}\n`
  report += `- Authentication: ${lpg8c.authentication ? "✅" : "❌"}\n`
  report += `- Authorization: ${lpg8c.authorization ? "✅" : "❌"}\n`
  report += `- Rate Limiting: ${lpg8c.rateLimiting ? "✅" : "❌"}\n`
  report += `- Caching: ${lpg8c.caching ? "✅" : "❌"}\n`
  report += `- Logging: ${lpg8c.logging ? "✅" : "❌"}\n`
  report += `- Monitoring: ${lpg8c.monitoring ? "✅" : "❌"}\n\n`

  report += "### Security Principles\n"
  Object.entries(lpg8c.principles).forEach(([principle, implemented]) => {
    const formattedPrinciple = principle.replace(/([A-Z])/g, " $1").toLowerCase()
    report += `- ${formattedPrinciple}: ${implemented ? "✅" : "❌"}\n`
  })

  return report
}
