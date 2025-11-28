export const generateMockTrend = (currentValue: string | number | undefined, points = 10): number[] => {
    if (!currentValue) return Array(points).fill(0)

    const numValue = typeof currentValue === 'string'
        ? parseFloat(currentValue.replace(/[^0-9.-]/g, '')) || 0
        : currentValue

    const trend = []
    const variance = numValue * 0.2

    for (let i = 0; i < points; i++) {
        const progress = i / (points - 1)
        const randomFactor = (Math.random() - 0.5) * variance
        const trendValue = numValue * (0.7 + progress * 0.3) + randomFactor
        trend.push(Math.max(0, Math.round(trendValue)))
    }

    return trend
}
