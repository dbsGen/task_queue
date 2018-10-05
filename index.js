
const Queue = require('./libs/queue');

function TaskQueue() {
    this.queues = {};
}

TaskQueue.prototype.task = function (key, action, complete) {
    let queue = this.queues[key];
    if (queue) {
        queue.on_completes.push(complete);
    }else {
        queue = new Queue(key);
        this.queues[key] = queue;
        queue.on_completes.push(complete);
        let self = this;
        action(function (suc, result) {
            queue.over(suc, result);
            delete self.queues[key];
        });
    }
};

module.exports = new TaskQueue();