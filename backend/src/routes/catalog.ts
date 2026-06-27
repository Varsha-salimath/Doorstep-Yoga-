import { Router } from 'express'
import { trainers, serviceCategories } from '../data'

export const catalogRouter = Router()

catalogRouter.get('/services', (_req, res) => {
  res.json({ services: serviceCategories })
})

catalogRouter.get('/trainers', (req, res) => {
  const category = req.query.category?.toString()
  if (!category) {
    return res.json({ trainers })
  }

  return res.json({
    trainers: trainers.filter((trainer) => trainer.category === category),
  })
})

catalogRouter.get('/trainers/:id', (req, res) => {
  const trainer = trainers.find((item) => item.id === req.params.id)
  if (!trainer) {
    return res.status(404).json({ message: 'Trainer not found.' })
  }
  return res.json({ trainer })
})
