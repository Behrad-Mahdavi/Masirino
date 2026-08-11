'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  HOLLAND_QUESTIONS,
  GARDNER_QUESTIONS,
  MBTI_QUESTIONS,
  DISC_BLOCKS,
} from '@/lib/data/mockQuestions';
import { LikertQuestion } from '@/components/tests/LikertQuestion';
import { BipolarSlider } from '@/components/tests/BipolarSlider';
import { IpsativeBlock } from '@/components/tests/IpsativeBlock';
import { TestProgressBar } from '@/components/tests/TestProgressBar';
import { Button } from '@/components/ui/Button';
import { scoreHolland } from '@/lib/scoring/holland';
import { scoreGardner } from '@/lib/scoring/gardner';
import { scoreMbti } from '@/lib/scoring/mbti';
import { scoreDisc } from '@/lib/scoring/disc';
import { computePathDna } from '@/lib/scoring/pathDna';
import { createClient } from '@/lib/supabase/client';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function TestRunnerPage() {
  const params = useParams();
  const router = useRouter();
  const testCode = (params.testCode as string)?.toUpperCase();

  // Answers State
  const [likertAnswers, setLikertAnswers] = useState<Record<string, number>>({});
  const [discAnswers, setDiscAnswers] = useState<Record<string, { most: any; least: any }>>({});
  const [submitting, setSubmitting] = useState(false);

  let testName = 'آزمون روان‌سنجی';
  let totalCount = 0;

  if (testCode === 'HOLLAND') {
    testName = 'آزمون رغبت‌سنجی شغلی هالند (RIASEC)';
    totalCount = HOLLAND_QUESTIONS.length;
  } else if (testCode === 'GARDNER') {
    testName = 'آزمون هوش‌های چندگانه گاردنر';
    totalCount = GARDNER_QUESTIONS.length;
  } else if (testCode === 'MBTI') {
    testName = 'آزمون سبک شخصیتی دوقطبی (MBTI)';
    totalCount = MBTI_QUESTIONS.length;
  } else if (testCode === 'DISC') {
    testName = 'ارزیابی رفتاری DISC';
    totalCount = DISC_BLOCKS.length;
  }

  const answeredCount =
    testCode === 'DISC'
      ? Object.values(discAnswers).filter((a) => a.most && a.least).length
      : Object.keys(likertAnswers).length;

  const isComplete = answeredCount === totalCount;

  const handleLikertChange = (qId: string, val: number) => {
    setLikertAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const handleDiscSelectMost = (bId: string, dim: 'D' | 'I' | 'S' | 'C') => {
    setDiscAnswers((prev) => ({
      ...prev,
      [bId]: {
        most: dim,
        least: prev[bId]?.least === dim ? null : prev[bId]?.least || null,
      },
    }));
  };

  const handleDiscSelectLeast = (bId: string, dim: 'D' | 'I' | 'S' | 'C') => {
    setDiscAnswers((prev) => ({
      ...prev,
      [bId]: {
        most: prev[bId]?.most === dim ? null : prev[bId]?.most || null,
        least: dim,
      },
    }));
  };

  const saveToSupabase = async (code: string, calculatedResult: any) => {
    try {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;

      if (!userId) return;

      const testIdMap: Record<string, number> = {
        HOLLAND: 1,
        GARDNER: 2,
        MBTI: 3,
        DISC: 4,
      };

      // 1. Insert into user_results table
      await supabase.from('user_results').insert({
        user_id: userId,
        test_id: testIdMap[code],
        dimension_scores: calculatedResult.scores || calculatedResult.normalizedScores || {},
        certainty_scores: calculatedResult.certaintyScores || null,
        final_output: calculatedResult,
        is_latest: true,
      });

      // 2. Synthesize & Upsert Path DNA
      const holland = code === 'HOLLAND' ? calculatedResult : JSON.parse(localStorage.getItem('test_result_HOLLAND') || '{}');
      const gardner = code === 'GARDNER' ? calculatedResult : JSON.parse(localStorage.getItem('test_result_GARDNER') || '{}');
      const mbti = code === 'MBTI' ? calculatedResult : JSON.parse(localStorage.getItem('test_result_MBTI') || '{}');
      const disc = code === 'DISC' ? calculatedResult : JSON.parse(localStorage.getItem('test_result_DISC') || '{}');

      const dna = computePathDna(
        Object.keys(holland).length ? holland : null,
        Object.keys(gardner).length ? gardner : null,
        Object.keys(mbti).length ? mbti : null,
        Object.keys(disc).length ? disc : null
      );

      await supabase.from('path_dna').upsert({
        user_id: userId,
        holland_code: dna.hollandCode,
        top_intelligences: dna.topIntelligences,
        mbti_type: dna.mbtiType,
        disc_profile: dna.discProfile,
        career_clusters: dna.careerClusters,
        computed_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    } catch (err) {
      console.warn('Supabase DB save warning:', err);
    }
  };

  const handleSubmit = async () => {
    if (!isComplete) return;
    setSubmitting(true);

    let calculatedResult: any = null;

    if (testCode === 'HOLLAND') {
      const responses = HOLLAND_QUESTIONS.map((q) => ({
        dimension: q.dimension as any,
        value: likertAnswers[q.id] || 3,
      }));
      calculatedResult = scoreHolland(responses);
      localStorage.setItem('test_result_HOLLAND', JSON.stringify(calculatedResult));
    } else if (testCode === 'GARDNER') {
      const responses = GARDNER_QUESTIONS.map((q) => ({
        dimension: q.dimension,
        value: likertAnswers[q.id] || 3,
      }));
      calculatedResult = scoreGardner(responses);
      localStorage.setItem('test_result_GARDNER', JSON.stringify(calculatedResult));
    } else if (testCode === 'MBTI') {
      const responses = MBTI_QUESTIONS.map((q) => ({
        axis: q.axis,
        value: likertAnswers[q.id] || 3,
      }));
      calculatedResult = scoreMbti(responses);
      localStorage.setItem('test_result_MBTI', JSON.stringify(calculatedResult));
    } else if (testCode === 'DISC') {
      const blocks = DISC_BLOCKS.map((b) => ({
        most: discAnswers[b.id]?.most || 'D',
        least: discAnswers[b.id]?.least || 'C',
      }));
      calculatedResult = scoreDisc(blocks);
      localStorage.setItem('test_result_DISC', JSON.stringify(calculatedResult));
    }

    if (calculatedResult) {
      await saveToSupabase(testCode, calculatedResult);
    }

    setSubmitting(false);
    router.push('/dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-xs font-bold text-ink-500 hover:text-teal-700">
          <ArrowRight className="w-4 h-4" /> بازگشت به داشبورد
        </Link>
        <span className="text-xs font-bold text-ink-500">ذخیره‌سازی هوشمند در Supabase</span>
      </div>

      {/* Progress Bar */}
      <TestProgressBar current={answeredCount} total={totalCount} testName={testName} />

      {/* Questions Renderer */}
      <div className="space-y-4">
        {testCode === 'HOLLAND' &&
          HOLLAND_QUESTIONS.map((q, idx) => (
            <LikertQuestion
              key={q.id}
              questionId={q.id}
              index={idx + 1}
              text={q.text}
              value={likertAnswers[q.id] || null}
              onChange={(val) => handleLikertChange(q.id, val)}
            />
          ))}

        {testCode === 'GARDNER' &&
          GARDNER_QUESTIONS.map((q, idx) => (
            <LikertQuestion
              key={q.id}
              questionId={q.id}
              index={idx + 1}
              text={q.text}
              value={likertAnswers[q.id] || null}
              onChange={(val) => handleLikertChange(q.id, val)}
            />
          ))}

        {testCode === 'MBTI' &&
          MBTI_QUESTIONS.map((q, idx) => (
            <BipolarSlider
              key={q.id}
              index={idx + 1}
              leftText={q.leftText}
              rightText={q.rightText}
              value={likertAnswers[q.id] || null}
              onChange={(val) => handleLikertChange(q.id, val)}
            />
          ))}

        {testCode === 'DISC' &&
          DISC_BLOCKS.map((b, idx) => (
            <IpsativeBlock
              key={b.id}
              index={idx + 1}
              options={b.options}
              most={discAnswers[b.id]?.most || null}
              least={discAnswers[b.id]?.least || null}
              onSelectMost={(dim) => handleDiscSelectMost(b.id, dim)}
              onSelectLeast={(dim) => handleDiscSelectLeast(b.id, dim)}
            />
          ))}
      </div>

      {/* Bottom Submit Action */}
      <div className="sticky bottom-4 bg-white border-thick border-ink-900 rounded-xl p-4 elevated-xl flex justify-between items-center mt-8">
        <span className="text-xs font-bold text-ink-500 font-numeric">
          {isComplete ? 'تمامی سوالات پاسخ داده شدند.' : `لطفاً به تمامی ${totalCount} سوال پاسخ دهید.`}
        </span>

        <Button
          variant="primary"
          size="lg"
          disabled={!isComplete}
          loading={submitting}
          onClick={handleSubmit}
          icon={<CheckCircle2 className="w-5 h-5" />}
        >
          ثبت و ذخیره در دیتابیس
        </Button>
      </div>
    </div>
  );
}
