function SettledPromise(status, result) {
    this.status = status;
    this.result = result;
}

function promiseAll(promises) {
    return new Promise((resolve, reject) => {
        let values = [];
        let completed = 0;
        values.length = promises.length;
        promises.forEach((pr, index) => {
            pr.then(result => {
                values[index] = result; 
                if (++completed === values.length) {
                    resolve(values);
                } 
            }).catch(error => reject(error));
        });  
    });
}

function promiseAllSettled(promises) {
    return new Promise((resolve) => {
        let values = [];
        values.length = promises.length;
        let completed = 0;
        promises.forEach((pr, index) => {
            pr.then(result => {
                values[index] = new SettledPromise('fulfilled', result);
                if (++completed === values.length) {
                    resolve(values);
                } 
            }).catch(error => {
                values[index] = new SettledPromise('rejected', error);
                if (++completed === values.length) {
                    resolve(values);
                } 
            });
        }); 
    });
}

function chainPromises(fns) {
    return new Promise((resolve, reject) => {
        let promise = fns[0]();
        for (let i = 1; i < fns.length; i++) {
            promise = promise.then(result => fns[i](result))
            .catch(error => reject(error));
        }
        promise.then(result => resolve(result))
        .catch(error => reject(error));
    });
}

function promisify(fn) {
    return function(value) {
        return new Promise((resolve, reject) => {
            fn(value, (errorMessage, result) => {
                if (errorMessage != null) {
                    reject(errorMessage);
                } else {
                    resolve(result);
                }
            });
        });
    }
}

export {promiseAll, promiseAllSettled, chainPromises, promisify};