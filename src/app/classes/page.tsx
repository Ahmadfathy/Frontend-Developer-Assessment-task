'use client';

import { GraduationCap } from 'lucide-react';
import { ClassCard } from '@/components/classes/ClassCard';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { useClasses } from '@/hooks/useClasses';

// Classes list — the '/classes' route from CLAUDE.md's routing table.
// Fetches every class and renders it as a responsive grid of ClassCard,
// each linking through to that class's detail page.
export default function ClassesPage() {
  const { data: classes, loading, error, refetch } = useClasses();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Classes</h1>
        <p className="text-sm text-muted-foreground">
          Browse every class and open one to see its enrolled students.
        </p>
      </div>

      {loading ? (
        <LoadingState label="Loading classes..." />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : !classes || classes.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No classes yet"
          description="Classes will show up here once they're added."
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((schoolClass) => (
            <ClassCard key={schoolClass.id} schoolClass={schoolClass} />
          ))}
        </div>
      )}
    </div>
  );
}
