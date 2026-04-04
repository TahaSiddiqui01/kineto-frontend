import { BaseEdge, EdgeProps, getStraightPath } from '@xyflow/react';
 
export function CustomEdge({ sourceX, sourceY, targetX, targetY, ...props }: EdgeProps) {
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
 
  const { label, labelStyle, markerStart, markerEnd, interactionWidth } = props;
 
  return (
    <BaseEdge
      path={edgePath}
      label={label}
      labelStyle={labelStyle}
      markerEnd={markerEnd}
      markerStart={markerStart}
      interactionWidth={interactionWidth}
    />
  );
}