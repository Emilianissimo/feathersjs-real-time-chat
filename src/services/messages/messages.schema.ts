// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getDataValidator, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'
import { userSchema } from '../users/users.schema';

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

// Main data model schema
export const messagesSchema = Type.Object(
  {
    id: Type.Number(),
    text: Type.String(),
    createdAt: Type.Number(),
    userId: Type.String(),
    user: Type.Ref(userSchema)
  },
  { $id: 'Messages', additionalProperties: false }
)
export type Messages = Static<typeof messagesSchema>
export const messagesResolver = resolve<Messages, HookContext>({
  user: virtual(async (message, context) => {
    return context.app.service('users').get(message.userId);
  })
})

export const messagesExternalResolver = resolve<Messages, HookContext>({})

// Schema for creating new entries
export const messagesDataSchema = Type.Pick(messagesSchema, ['text'], {
  $id: 'MessagesData'
})
export type MessagesData = Static<typeof messagesDataSchema>
export const messagesDataValidator = getDataValidator(messagesDataSchema, dataValidator)
export const messagesDataResolver = resolve<Messages, HookContext>({
  userId: async(_value, _message, context) => {
    return context.params.user.id
  },
  createdAt: async() => Date.now()
})

// Schema for updating existing entries
export const messagesPatchSchema = Type.Partial(messagesDataSchema, {
  $id: 'MessagesPatch'
})
export type MessagesPatch = Static<typeof messagesPatchSchema>
export const messagesPatchValidator = getDataValidator(messagesPatchSchema, dataValidator)
export const messagesPatchResolver = resolve<Messages, HookContext>({})

// Schema for allowed query properties
export const messagesQueryProperties = Type.Pick(messagesSchema, ['id', 'text', 'createdAt', 'userId'])
export const messagesQuerySchema = Type.Intersect(
  [
    querySyntax(messagesQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type MessagesQuery = Static<typeof messagesQuerySchema>
export const messagesQueryValidator = getValidator(messagesQuerySchema, queryValidator)
export const messagesQueryResolver = resolve<MessagesQuery, HookContext>({})
