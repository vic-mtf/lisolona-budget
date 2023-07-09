import { motion } from "framer-motion"
import React from "react"
import {
  styled
} from '@mui/material';

const Container = styled('div')(() => ({
  display: 'flex',
}));

const Card = styled(motion.div)(() => ({
  background: '#999999',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  height: '100%',
  fontFamily: 'sans-serif',
  fontWeight: 600,
}));

export function GridItem({
  items,
  columnCount,
  rowIndex,
  columnIndex,
  gutterSize,
  style
}) {
  const index = rowIndex * columnCount + columnIndex

  if (index > items.length - 1) {
    return <></>
  }

  return (
    <Container style={style}>
      <Card
        variants={{
          hidden: {
            opacity: 0
          },
          visible: {
            opacity: 1
          }
        }}
        initial="hidden"
        animate="visible"
      >
        {items[index].name}
      </Card>
    </Container>
  )
}
