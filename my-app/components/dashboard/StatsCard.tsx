import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'

const StatsCard = () => {
  return (
    <Card x-chunk="dashboard-05-chunk-2">
    <CardHeader className="pb-2">
      <CardDescription>This Year</CardDescription>
      <CardTitle className="text-4xl">$45,329</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-xs text-muted-foreground">+10% from last year</div>
    </CardContent>
    <CardFooter>
      {/* <Progress value={12} aria-label="12% increase" /> */}
    </CardFooter>
  </Card>
  )
}

export default StatsCard