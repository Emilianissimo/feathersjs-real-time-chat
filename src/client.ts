// For more information about this file see https://dove.feathersjs.com/guides/cli/client.html
import { feathers } from '@feathersjs/feathers'
import type { TransportConnection, Params } from '@feathersjs/feathers'
import authenticationClient from '@feathersjs/authentication-client'
import type { Messages, MessagesData, MessagesQuery, MessagesService } from './services/messages/messages'
export type { Messages, MessagesData, MessagesQuery }

import type { User, UserData, UserQuery, UserService } from './services/users/users'
export type { User, UserData, UserQuery }

import type { AuthenticationClientOptions } from '@feathersjs/authentication-client'

const userServiceMethods = ['find', 'get', 'create', 'update', 'patch', 'remove'] as const
type UserClientService = Pick<UserService<Params<UserQuery>>, (typeof userServiceMethods)[number]>

const messagesServiceMethods = ['find', 'get', 'create', 'update', 'patch', 'remove'] as const
type MessagesClientService = Pick<
  MessagesService<Params<MessagesQuery>>,
  (typeof messagesServiceMethods)[number]
>

export interface ServiceTypes {
  messages: MessagesClientService
  users: UserClientService
  //
}

/**
 * Returns a typed client for the feathers-chat app.
 *
 * @param connection The REST or Socket.io Feathers client connection
 * @param authenticationOptions Additional settings for the authentication client
 * @see https://dove.feathersjs.com/api/client.html
 * @returns The Feathers client application
 */
export const createClient = <Configuration = any>(
  connection: TransportConnection<ServiceTypes>,
  authenticationOptions: Partial<AuthenticationClientOptions> = {}
) => {
  const client = feathers<ServiceTypes, Configuration>()

  client.configure(connection)
  client.configure(authenticationClient(authenticationOptions))

  client.use('users', connection.service('users'), {
    methods: userServiceMethods
  })
  client.use('messages', connection.service('messages'), {
    methods: messagesServiceMethods
  })
  return client
}
