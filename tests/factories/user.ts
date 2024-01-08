import { Factory } from 'rosie'

Factory.define('user-1')
    .attr('id', '1')
    .attr('user_name', 'user1')
    .attr('password', '123')
    .attr('created_at', new Date().toISOString())
    .attr('updated_at', new Date().toISOString())

Factory.define('user-2')
    .attr('id', '2')
    .attr('user_name', 'user2')
    .attr('password', '123')
    .attr('created_at', new Date().toISOString())
    .attr('updated_at', new Date().toISOString())
