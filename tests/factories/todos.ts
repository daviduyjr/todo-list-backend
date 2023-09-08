import { Factory } from 'rosie'

Factory.define('todo-1')
    .attr('id', '1')
    .attr('name', 'Exercise')
    .attr('when_done', null)
    .attr('deleted_at', null)
    .attr('created_at', new Date().toISOString())
    .attr('updated_at', new Date().toISOString())

Factory.define('todo-2')
    .attr('id', '2')
    .attr('name', 'Cook')
    .attr('when_done', new Date().toISOString())
    .attr('deleted_at', new Date().toISOString())
    .attr('created_at', new Date().toISOString())
    .attr('updated_at', new Date().toISOString())
