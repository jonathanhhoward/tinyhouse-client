import React, { Fragment } from "react";
import { Skeleton } from "antd";

function SkeletonParagraph() {
  return (
    <Skeleton
      active
      paragraph={{ rows: 4 }}
      className="page-skeleton__paragraph"
    />
  );
}

export function PageSkeleton() {
  return (
    <Fragment>
      <SkeletonParagraph />
      <SkeletonParagraph />
      <SkeletonParagraph />
    </Fragment>
  );
}
