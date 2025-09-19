// Card.jsx
import { motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
import { fetchAllCards } from '../../services/operations'
import { useApi } from '../../hooks/useApi'

import ThankYou from '../thankyou/ThankYou'
import CardNavigation from './CardNavigation'
import QuestionSection from './QuestionSection'
import { useCurrentQuestion } from '../../context/CurrentQuestionContext'
import SuggestQuestion from './SuggestQuestion'

const SWIPE_THRESHOLD = 60;           // px needed to trigger a swipe
const ANGLE_GUARD = 0.6;              // require mostly-horizontal: |dx| > 0.6*|dy|

const Card = () => {
  const { data: questionsData = [], loading, error } = useApi(fetchAllCards)
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [nextBackgroundImage, setNextBackgroundImage] = useState(null)
  const [direction, setDirection] = useState('next')
  const [showSuggestQuestion, setShowSuggestQuestion] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { setQuestionId } = useCurrentQuestion()

  // swipe state (touch/pointer)
  const startX = useRef(0)
  const startY = useRef(0)
  const tracking = useRef(false)
  const blocked = useRef(false) // prevent double-trigger while animating

  useEffect(() => {
    if (questionsData) setQuestions(questionsData)
  }, [questionsData])

  useEffect(() => {
    if (questions.length > 0 && !showSuggestQuestion) {
      setQuestionId(questions[currentQuestionIndex]?.id || null)
    } else {
      setQuestionId(null)
    }
  }, [questions, currentQuestionIndex, setQuestionId, showSuggestQuestion])

  // 🔑 also mark userResponse after vote (so revisiting shows results)
  const updateQuestionOptions = (questionId, newOptions) => {
    setQuestions(prev =>
      prev.map(q =>
        q.id === questionId
          ? {
            ...q,
            answerOptions: newOptions,
            userResponse: {
              ...q.userResponse,
              answered: true,
              selectedOptionId:
                newOptions.find(o => o.isSelected)?.id ??
                q.userResponse?.selectedOptionId,
            },
          }
          : q
      )
    )
  }

  const goToIndex = (newIndex, dir) => {
    if (blocked.current) return
    blocked.current = true
    setDirection(dir)
    setNextBackgroundImage(questions[newIndex]?.backgroundImageUrl)
    setTimeout(() => {
      setCurrentQuestionIndex(newIndex)
      setNextBackgroundImage(null)
      blocked.current = false
    }, 150) // keep your quick transition
  }

  const handleNextQuestion = () => {
    if (showSuggestQuestion) {
      setShowSuggestQuestion(false)
      setCurrentQuestionIndex(0)
      return
    }
    if (currentQuestionIndex === questions.length - 1) {
      setShowSuggestQuestion(true)
      return
    }
    goToIndex(currentQuestionIndex + 1, 'next')
  }

  const handlePreviousQuestion = () => {
    if (showSuggestQuestion) {
      setShowSuggestQuestion(false)
      setCurrentQuestionIndex(questions.length - 1)
      return
    }
    if (currentQuestionIndex === 0) {
      setShowSuggestQuestion(true)
      return
    }
    goToIndex(currentQuestionIndex - 1, 'prev')
  }

  // ---------- Swipe handlers ----------
  const onTouchStart = (e) => {
    if (isDrawerOpen) return
    const t = e.touches?.[0]
    if (!t) return
    startX.current = t.clientX
    startY.current = t.clientY
    tracking.current = true
  }

  const onTouchMove = (e) => {
    if (!tracking.current) return
    // If mostly horizontal, prevent the browser from hijacking
    const t = e.touches?.[0]
    if (!t) return
    const dx = t.clientX - startX.current
    const dy = t.clientY - startY.current
    if (Math.abs(dx) > ANGLE_GUARD * Math.abs(dy)) {
      // prevent vertical scroll only when horizontal intent is obvious
      e.preventDefault()
    }
  }

  const onTouchEnd = (e) => {
    if (!tracking.current) return
    tracking.current = false
    if (isDrawerOpen) return

    const t = e.changedTouches?.[0]
    if (!t) return
    const dx = t.clientX - startX.current
    const dy = t.clientY - startY.current

    // require mostly horizontal gesture
    if (Math.abs(dx) <= ANGLE_GUARD * Math.abs(dy)) return

    if (dx <= -SWIPE_THRESHOLD) {
      // swipe left => next
      handleNextQuestion()
    } else if (dx >= SWIPE_THRESHOLD) {
      // swipe right => prev
      handlePreviousQuestion()
    }
  }

  return (
    <div className="flex overflow-hidden flex-col mx-auto w-full max-w-[480px] max-h-screen-dvh relative">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-white">Loading...</div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-red-500">Error loading questions</div>
        </div>
      ) : showSuggestQuestion ? (
        <SuggestQuestion onNext={handleNextQuestion} onPrevious={handlePreviousQuestion} />
      ) : questions.length > 0 ? (
        // touch-action: pan-y lets vertical page scroll while still allowing horizontal swipes we detect
        <div
          className="relative flex flex-col w-full h-screen-svh bg-center bg-cover"
          style={{ backgroundImage: `url(${questions[currentQuestionIndex]?.backgroundImageUrl})`, touchAction: 'pan-y' }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* animated incoming background */}
          <motion.div
            key={`bg-next-${currentQuestionIndex}`}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${nextBackgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            initial={{ x: direction === 'next' ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          />

          {/* half-screen click navigation (kept) */}
          {!isDrawerOpen && (
            <CardNavigation
              onNext={handleNextQuestion}
              onPrevious={handlePreviousQuestion}
            />
          )}

          {/* content */}
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            <QuestionSection
              question={questions[currentQuestionIndex]}
              onVoteUpdate={updateQuestionOptions}
              onDrawerToggle={setIsDrawerOpen}
            />
          </motion.div>
        </div>
      ) : (
        <ThankYou />
      )}
    </div>
  )
}

export default Card
