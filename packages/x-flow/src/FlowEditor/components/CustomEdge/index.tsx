import { memo } from 'react';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { BezierEdge, EdgeLabelRenderer, getBezierPath, useReactFlow } from '@xyflow/react';
import { useShallow } from 'zustand/react/shallow';
import produce from 'immer';
import { uuid } from '../../utils';
import useStore from '../../store';
import NodeSelectPopover from '../NodeSelectPopover';
import './index.less';

export default memo((edge: any) => {
  const {
    label,
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    data,
    selected,
    source,
    target,
  } = edge;

  const reactflow = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const {
    nodes,
    setNodes,
    mousePosition,
  } = useStore(
    useShallow((state: any) => ({
      nodes: state.nodes,
      mousePosition: state.mousePosition,
      setNodes: state.setNodes
    }))
  );

  const handleAddNode = (data: any) => {
    const { screenToFlowPosition } = reactflow;
    const { x, y } = screenToFlowPosition({ x: mousePosition.pageX, y: mousePosition.pageY });

    const newNodes = produce(nodes, (draft: any) => {
      draft.push({
        id: uuid(),
        type: 'custom',
        data,
        position: { x, y }
      });
    });
    setNodes(newNodes);
  };
  
  return (
    <BezierEdge
      {...edge}
      sourceY={edge.sourceY - 15}
      targetY={edge.targetY + 13}
      selected={false}
      edgePath={edgePath}
      label={
        <EdgeLabelRenderer>
          <div
            className='custom-edge-line'
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
          >
            <div className='line-content'>
              <div className='icon-box'>
                <CloseOutlined style={{ color: '#fff', fontSize: 12 }} />
              </div>
              <NodeSelectPopover placement='right' addNode={handleAddNode}>
                <div className='icon-box'>
                  <PlusOutlined style={{ color: '#fff', fontSize: 12 }} />
                </div>
              </NodeSelectPopover>
            </div>
          </div>
        </EdgeLabelRenderer>
      }
    />
  );
});