// Card.jsx
import { motion } from 'framer-motion'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useSearchParams, useParams, useNavigate } from 'react-router-dom'
import { fetchAllCards } from '../../services/operations'
import { useApi } from '../../hooks/useApi'
import CardNavigation from './CardNavigation'
import QuestionSection from './QuestionSection'
import { useCurrentQuestion } from '../../context/CurrentQuestionContext'
import ShareStanceThanks from '../thankyou/ShareStanceThanks'
import { useAuth } from '../../context/AuthContext'
import LoginSignupModal from '../auth/LoginSignupModal'
import { ALLOWED_CATEGORIES } from '../../utils/constants'

const SWIPE_THRESHOLD = 60;           // px needed to trigger a swipe
const ANGLE_GUARD = 0.6;              // require mostly-horizontal: |dx| > 0.6*|dy|

const Card = () => {
  const { data: questionsData = [], loading, error } = useApi(fetchAllCards)
  const [questions, setQuestions] = useState([])
  const [isInitializing, setIsInitializing] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [nextBackgroundImage, setNextBackgroundImage] = useState(null)
  const [direction, setDirection] = useState('next')
  const [showSuggestQuestion, setShowSuggestQuestion] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const { setQuestionId } = useCurrentQuestion()
  const { isAuthenticated } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const { category } = useParams()
  const navigate = useNavigate()

  const questionIdParam = useMemo(() => {
    try {
      return new URLSearchParams(location.search).get('questionid')
    } catch {
      return null
    }
  }, [location.search])

  const slugParam = useMemo(() => {
    if (category && !ALLOWED_CATEGORIES.includes(category)) {
      return category
    }
    return null
  }, [category])
  
  const updateUrl = useCallback((question) => {
    if (!question) {
      // if no question (e.g. end of list?), maybe go to root?
      // navigate('/', { replace: true })
      return
    }
    if (question.slug) {
      navigate(`/${question.slug}`, { replace: true })
    } else {
      // fallback to query param if no slug
      navigate(`/?questionid=${question.id}`, { replace: true })
    }
  }, [navigate])

  // swipe state (touch/pointer)
  const startX = useRef(0)
  const startY = useRef(0)
  const tracking = useRef(false)
  const blocked = useRef(false) // prevent double-trigger while animating



  useEffect(() => {
    if (questions.length > 0 && !showSuggestQuestion) {
      setQuestionId(questions[currentQuestionIndex]?.id || null)
      // Update hasVoted based on current question
      const currentQuestion = questions[currentQuestionIndex]
      setHasVoted(Boolean(currentQuestion?.userResponse?.answered))
    } else {
      setQuestionId(null)
      setHasVoted(false)
    }
  }, [questions, currentQuestionIndex, setQuestionId, showSuggestQuestion])

  // Auto-refresh page every 12 hours
  useEffect(() => {
    const interval = setInterval(() => {
      window.location.reload()
    }, 43200000)
    return () => clearInterval(interval)
  }, [])

  // 🔑 also mark userResponse after vote (so revisiting shows results)
  const updateQuestionOptions = (questionId, newOptions, selectedOptionId) => {
    setQuestions(prev =>
      prev.map(q =>
        q.id === questionId
          ? {
            ...q,
            answerOptions: newOptions,
            userResponse: {
              ...q.userResponse,
              answered: true,
              selectedOptionId: selectedOptionId ??
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
      const nextQuestion = questions[newIndex]
      if (nextQuestion) {
        updateUrl(nextQuestion)
      }
    }, 150) // keep your quick transition
  }

  const handleNextQuestion = () => {
    if (showSuggestQuestion) {
      setShowSuggestQuestion(false)
      setCurrentQuestionIndex(0)
      const firstQuestion = questions[0]
      if (firstQuestion) {
        updateUrl(firstQuestion)
      }
      return
    }

    // Check if user is authenticated before any navigation
    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }

    if (currentQuestionIndex === questions.length - 1) {
      // Track "Open Suggest Question Screen"
      import('../../utils/mixpanel').then(({ default: mixpanel }) => {
        mixpanel.trackEvent("Open Suggest Question Screen");
      });
      setShowSuggestQuestion(true)
      return
    }

    goToIndex(currentQuestionIndex + 1, 'next')
  }

  const handlePreviousQuestion = () => {
    if (showSuggestQuestion) {
      setShowSuggestQuestion(false)
      setCurrentQuestionIndex(questions.length - 1)
      const lastQuestion = questions[questions.length - 1]
      if (lastQuestion) {
        updateUrl(lastQuestion)
      }
      return
    }

    // Check if user is authenticated before any navigation
    if (!isAuthenticated) {
      setShowLoginModal(true)
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
      // Track "Swipe Next"
      import('../../utils/mixpanel').then(({ default: mixpanel }) => {
        mixpanel.trackEvent("Swipe Next");
      });
      handleNextQuestion()
    } else if (dx >= SWIPE_THRESHOLD) {
      // swipe right => prev
      // Track "Swipe Previous"
      import('../../utils/mixpanel').then(({ default: mixpanel }) => {
        mixpanel.trackEvent("Swipe Previous");
      });
      handlePreviousQuestion()
    }
  }

  // encodes spaces and any unsafe chars, but won't mangle query/host
  const toSafeBg = (u) => {
    if (!u) return "";
    try {
      // If it's already a valid absolute URL, this normalizes spaces -> %20
      return new URL(u).href;
    } catch {
      // Fallback for relative or slightly malformed URLs
      return encodeURI(u);
    }
  };

  useEffect(() => {
    if (loading) return

    if (!questionsData?.length) {
      setIsInitializing(false)
      return
    }

    if (questions.length > 0) {
      setIsInitializing(false)
      return
    }

    const sanitize = (data) => data.map(q => ({
      ...q,
      backgroundImageUrl: toSafeBg(q.backgroundImageUrl),
    }));

    const initializeQuestions = async () => {
      let finalData = questionsData;

      // Priority 1: Check for slug match
      if (slugParam) {
        const idx = questionsData.findIndex(q => q.slug === slugParam);
        if (idx === -1) {
          // If not found by slug in initial batch, we can't easily fetch by slug yet
          // unless we add a new API call. For now, fallback to default order or maybe Try by ID if we could guess it (we can't)
          // Maybe we should redirect to home? Or just show default list.
          // We'll just show default list.
        }
      }
      // Priority 2: Check for ID match (fallback for old links)
      else if (questionIdParam) {
        const existsInInitial = questionsData.some(q => String(q.id) === questionIdParam);

        if (!existsInInitial) {
          try {
            // Attempt to fetch with the specific ID
            const retryData = await fetchAllCards(questionIdParam);
            const existsInRetry = retryData?.some(q => String(q.id) === questionIdParam);

            if (existsInRetry) {
              finalData = retryData;
            }
          } catch (err) {
            console.error('Retry fetch failed', err);
          }
        }
      }

      // Sanitize and Reorder
      let processed = sanitize(finalData);

      if (slugParam) {
        const idx = processed.findIndex(q => q.slug === slugParam);
        if (idx > -1) {
          const [target] = processed.splice(idx, 1);
          processed.unshift(target);
        }
      } else if (questionIdParam) {
        const idx = processed.findIndex(q => String(q.id) === questionIdParam);
        if (idx > -1) {
          const [target] = processed.splice(idx, 1);
          processed.unshift(target);
        }
      }

      setQuestions(processed);
      setIsInitializing(false)
    };

    initializeQuestions();
  }, [questionsData, questionIdParam, slugParam, questions.length, loading]);

  useEffect(() => {
    if (!questions.length) return

    const currentQuestion = questions[currentQuestionIndex]
    const currentSlug = currentQuestion?.slug
    const currentId = currentQuestion?.id

    if (slugParam) {
      const targetIndex = questions.findIndex(q => q.slug === slugParam)
      if (targetIndex !== -1) {
        if (showSuggestQuestion && slugParam !== currentSlug) {
          setShowSuggestQuestion(false)
        }
        if (targetIndex !== currentQuestionIndex) {
          setCurrentQuestionIndex(targetIndex)
          // URL is already correct (slugParam matches)
        }
        return
      }
    } else if (questionIdParam) {
      const targetIndex = questions.findIndex(q => String(q.id) === questionIdParam)
      if (targetIndex !== -1) {
        if (
          showSuggestQuestion &&
          questionIdParam !== String(currentId ?? '')
        ) {
          setShowSuggestQuestion(false)
        }
        if (targetIndex !== currentQuestionIndex) {
          setCurrentQuestionIndex(targetIndex)
          // If we have a slug for this question, we should prefer updating URL to slug?
          // Optional: Upgrade URL from ID to slug automatically?
          // Let's do it to "fix" old links
          const targetQuestion = questions[targetIndex]
          if (targetQuestion?.slug) {
            updateUrl(targetQuestion)
          }
        }
        return
      }
    }

    // Fallback or "Home" state
    const fallbackQuestion = questions[0]
    if (fallbackQuestion) {
      if (showSuggestQuestion) {
        // We are in suggest mode, URL might should reflect that or stay on last question?
        // Original logic: setShowSuggestQuestion(false)
        setShowSuggestQuestion(false)
      }
      if (currentQuestionIndex !== 0) {
        setCurrentQuestionIndex(0)
      }

      // Ensure URL matches the fallback question if no params provided
      if (!slugParam && !questionIdParam) {
        updateUrl(fallbackQuestion)
      }
    }
  }, [
    slugParam,
    questionIdParam,
    questions,
    currentQuestionIndex,
    showSuggestQuestion,
    updateUrl,
  ])



  return (
    <div className="flex overflow-hidden flex-col mx-auto w-full max-w-[480px] max-h-screen-dvh relative" >
      {(loading || isInitializing) ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-white">Loading...</div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-red-500">Error loading questions</div>
        </div>
      ) : showSuggestQuestion ? (
        <ShareStanceThanks onNext={handleNextQuestion} onPrevious={handlePreviousQuestion} />
      ) : questions.length > 0 ? (
        // touch-action: pan-y lets vertical page scroll while still allowing horizontal swipes we detect
        <div
          className="relative flex flex-col w-full h-screen-svh bg-center bg-cover"
          style={{ backgroundImage: `url("${toSafeBg(questions[currentQuestionIndex]?.backgroundImageUrl)}")`, touchAction: 'pan-y' }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* animated incoming background */}
          <div className="absolute inset-0 custom-gradient"></div>

          <motion.div
            key={`bg-next-${currentQuestionIndex}`}
            className="absolute inset-0"
            style={{
              backgroundImage: nextBackgroundImage ? `url("${toSafeBg(nextBackgroundImage)}")` : "none",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            initial={{ x: direction === 'next' ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          />

          {/* half-screen click navigation (kept) */}
          {!isDrawerOpen && !hasVoted && (
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
              onNext={handleNextQuestion}
              onPrevious={handlePreviousQuestion}
              hasVoted={hasVoted}
              onHasVotedChange={setHasVoted}
            />
          </motion.div>
        </div>
      ) : (
        <ShareStanceThanks onNext={handleNextQuestion} onPrevious={handlePreviousQuestion} />
      )}

      {/* Login/Signup Modal for navigation */}
      <LoginSignupModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  )
}

export default Card
