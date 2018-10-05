
function Queue(key) {
    this.key = key;
    this.on_completes = [];
}

Queue.prototype.over = function (suc, result) {
    for (let i = 0, t = this.on_completes.length; i < t; ++i) {
        let c = this.on_completes[i];
        c(suc, result);
    }
};

module.exports = Queue;