'use client';
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

export default function Component() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
    toast({
      title: "You're on the list!",
      description: "We'll notify you when Discover launches.",
    })
    setEmail('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-indigo-900 text-white p-4">
      <div className="max-w-3xl w-full space-y-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-extrabold mb-2">Discover is coming soon</h1>
          <p className="text-2xl mb-8">Find and pay top-tier freelancers with ease</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-xl"
        >
          <h2 className="text-3xl font-bold mb-4">Get ready to:</h2>
          <ul className="text-xl mb-6 space-y-2">
            <li>• Discover exceptional freelance talent</li>
            <li>• Streamline your hiring process</li>
            <li>• Pay seamlessly with Streambill</li>
          </ul>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white bg-opacity-20 border-white border-opacity-30 text-white placeholder-gray-300"
            />
            <Button type="submit" disabled={isLoading} className="bg-white text-purple-700 hover:bg-gray-200">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Notify me'
              )}
            </Button>
          </form>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-sm mt-8"
        >
          Be the first to experience the future of freelancing
        </motion.p>
      </div>
    </div>
  )
}