"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Clock, DollarSign, Download, FileText, AlertCircle } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Mock data for the chart (representing money unlocking over time)
const chartData = [
  { day: 1, amount: 100 },
  { day: 5, amount: 250 },
  { day: 10, amount: 400 },
  { day: 15, amount: 600 },
  { day: 20, amount: 800 },
  { day: 25, amount: 900 },
  { day: 30, amount: 1000 },
]

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

export default function GigPaymentDashboard() {
  const totalAmount = 1000
  const streamedAmount = 600
  const withdrawnAmount = 400

  return (
    <div className="container mx-auto p-6 space-y-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <Card className="border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="text-3xl font-bold">Gig Payment Status</CardTitle>
          <CardDescription className="text-blue-100">Track your payment progress</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Payment Schedule</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="day" label={{ value: 'Days', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip 
                      formatter={(value) => formatCurrency(value as number)}
                      labelFormatter={(label) => `Day ${label}`}
                    />
                    <Line type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Total Gig Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-blue-600">{formatCurrency(totalAmount)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Payment Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1 text-sm font-medium">
                      <span>Money Streamed Total</span>
                      <span>{formatCurrency(streamedAmount)}</span>
                    </div>
                    <Progress value={(streamedAmount / totalAmount) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm font-medium">
                      <span>Money Withdrawn</span>
                      <span>{formatCurrency(withdrawnAmount)}</span>
                    </div>
                    <Progress value={(withdrawnAmount / totalAmount) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="flex flex-wrap gap-4 justify-center">
            <Button className="bg-green-600 hover:bg-green-700">
              <Download className="mr-2 h-4 w-4" /> Withdraw Available Funds
            </Button>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" /> View Invoice
            </Button>
            <Button variant="secondary">
              <AlertCircle className="mr-2 h-4 w-4" /> Report an Issue
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Gig Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-bold text-lg">Web Development Project</h3>
              <p className="text-muted-foreground">Custom website development using React and Next.js</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-sm">
                <Clock className="mr-1 h-4 w-4" />
                30 days project
              </Badge>
              <Badge variant="outline" className="text-lg font-bold">
                <DollarSign className="h-4 w-4 mr-1" />
                {formatCurrency(totalAmount)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}