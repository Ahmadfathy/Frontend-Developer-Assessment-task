'use client';

import Link from 'next/link';
import { ArrowRight, GraduationCap, Layers, UserCheck, Users } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { ResumeClassBanner } from '@/components/classes/ResumeClassBanner';
import { Button } from '@/components/ui/button';
import { useClasses } from '@/hooks/useClasses';
import { useStudents } from '@/hooks/useStudents';

// School overview — the '/' route from CLAUDE.md's routing table. Shows
// headline stats (students/classes/active students) derived from the
// fetched lists, plus a quick-access grid of classes.
export default function DashboardPage() {
  const classesQuery = useClasses();
  const studentsQuery = useStudents();

  const classes = classesQuery.data ?? [];
  const students = studentsQuery.data ?? [];

  const loading = classesQuery.loading || studentsQuery.loading;
  const error = classesQuery.error ?? studentsQuery.error;

  // Re-runs whichever request(s) are backing this page, e.g. after the
  // user fixes whatever caused the error and hits Retry.
  function retry() {
    classesQuery.refetch();
    studentsQuery.refetch();
  }

  // Derived stats — never hardcoded, always computed from the fetched
  // lists per CLAUDE.md's "Derived data" rules.
  const totalStudents = students.length;
  const totalClasses = classes.length;
  const activeStudents = students.filter((student) => student.status === 'active').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          An overview of your school&apos;s classes and students.
        </p>
      </div>

      <ResumeClassBanner />

      {error ? (
        <ErrorState message={error} onRetry={retry} />
      ) : (
        <>
          {/* Headline stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              label="Total Students"
              value={totalStudents}
              icon={Users}
              loading={loading}
            />
            <StatCard
              label="Total Classes"
              value={totalClasses}
              icon={GraduationCap}
              loading={loading}
            />
            <StatCard
              label="Active Students"
              value={activeStudents}
              icon={UserCheck}
              loading={loading}
            />
          </div>

          {/* Quick access to classes */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Classes</h2>
              <Button
                variant="outline"
                size="sm"
                nativeButton={false}
                render={<Link href="/classes" />}
              >
                View all
                <ArrowRight />
              </Button>
            </div>

            {loading ? (
              <LoadingState label="Loading classes..." />
            ) : classes.length === 0 ? (
              <EmptyState
                icon={Layers}
                title="No classes yet"
                description="Classes will show up here once they're added."
              />
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {classes.map((schoolClass) => (
                  <Link
                    key={schoolClass.id}
                    href={`/classes/${schoolClass.id}`}
                    className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm transition-colors hover:bg-muted"
                  >
                    <span className="font-medium">{schoolClass.name}</span>
                    <span className="text-muted-foreground">
                      {schoolClass.studentIds.length} students
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
