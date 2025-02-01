'use client'

import { motion } from 'framer-motion'
import styles from './page.module.css'

export default function UpcomingCourses() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="mb-8 flex justify-center">
          <div className={styles.loader}></div>
        </div>
        <h1 className="text-4xl font-bold mb-4">Coming Soon</h1>
        <p className="text-lg">
          We're working on something awesome. Stay tuned!
        </p>
      </motion.div>
    </div>
  )
}
