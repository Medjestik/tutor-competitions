import folderIcon from '../../../../../shared/icons/lms/folder.svg';
import sliderIcon from '../../../../../shared/icons/lms/slider.svg';
import taskIcon from '../../../../../shared/icons/lms/task.svg';
import testIcon from '../../../../../shared/icons/lms/test.svg';
import textIcon from '../../../../../shared/icons/lms/text.svg';

import type { ILmsLearnerCoursePart, ILmsMaterialsPart } from '../../../../../shared/utils/api';

type TTreePart = ILmsLearnerCoursePart | ILmsMaterialsPart;

export const LMS_PART_ICONS: Record<string, string> = {
  folder: folderIcon,
  slider: sliderIcon,
  task: taskIcon,
  test: testIcon,
  text: textIcon,
};

export const getPartIcon = (code: string) => LMS_PART_ICONS[code] || textIcon;

export const buildTreeOrder = <TPart extends TTreePart>(parts: TPart[]): TPart[] => {
  const byParent = new Map<number | null, TPart[]>();

  parts.forEach((part) => {
    const key = part.parent_id ?? null;
    const list = byParent.get(key) || [];
    list.push(part);
    byParent.set(key, list);
  });

  byParent.forEach((list) => {
    list.sort((a, b) => a.position - b.position || a.id - b.id);
  });

  const result: TPart[] = [];
  const walk = (parentId: number | null) => {
    const children = byParent.get(parentId) || [];
    children.forEach((child) => {
      result.push(child);
      walk(child.id);
    });
  };

  walk(null);
  return result;
};

export const getNextPlayablePart = <TPart extends TTreePart>(
  parts: TPart[],
  currentPartId: number
): TPart | null => {
  const currentIndex = parts.findIndex((part) => part.id === currentPartId);
  if (currentIndex === -1) {
    return null;
  }

  return (
    parts
      .slice(currentIndex + 1)
      .find((part) => part.part_type.code !== 'folder') || null
  );
};
