
const Queue = require('./libs/queue');
const fs = require('fs');

const MINUTE = 60 * 1000;
const HOURS = 60 * MINUTE;
const DAY = 24 * HOURS;

function TaskQueue(ops) {
    this.queues = {};
    this.options = ops;
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

TaskQueue.prototype.cache = function (key, time, action, complete) {
    let path = this.options.path+'/c_'+key+'.cache';
    let stat = fs.statSync(path);
    if (new Date().getTime() - stat.mtime.getTime() < time) {
        complete(true, fs.readFileSync(path));
    } else {
        this.task(key, action, function (suc, result) {
            if (suc) {
                if (result instanceof String) {
                    fs.writeFileSync(path, result);
                } else {
                    fs.writeFileSync(path, JSON.stringify(result));
                }
                complete(suc, result);
            } else {
                complete(suc, result);
            }
        });
    }
};

module.exports = new TaskQueue();

module.exports.MINUTE = MINUTE;
module.exports.HOURS = HOURS;
module.exports.DAY = DAY;