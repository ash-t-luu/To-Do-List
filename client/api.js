// build out get task
export async function getTaskApi() {
    try {
        const response = await fetch('/crud/tasks', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (response.ok && response.status === 200) {
            const data = await response.json();
            return data;
        } else {
            throw new Error(`Request failed with status ${response.status}`);
        }
    } catch (error) {
        throw new Error(`Error in getTaskApi: ${error.message}`);

    }
};

// build out add a task 
export async function addTaskApi(task_name) {
    try {
        const response = await fetch('/crud/addTask', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task_name })
        });

        if (response.ok && response.status === 200) {
            const data = await response.json();
            return data;
        } else {
            const errorResponse = await response.json();
            throw new Error(errorResponse.message);
        }
    } catch (error) {
        throw new Error(`Error in addTaskApi: ${error.message}`);
    }
};

// build out delete a task
export async function deleteTaskApi(taskId) {
    try {
        const response = await fetch(`/crud/deleteTask/${taskId}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        console.log(response, 'res in api');
        if (response.ok && response.status === 200) {
            console.log(`Task ${taskId} deleted successfully`);
        } else {
            const errorResponse = await response.json();
            throw new Error(errorResponse.message);
        }
    } catch (error) {
        throw new Error(`Error in deleteTaskApi: ${error.message}`);
    }
};

// build out update a task
export async function editTaskApi(taskId, task_name) {
    try {
        const response = await fetch(`/crud/editTask/${taskId}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task_name })
        });

        if (response.ok && response.status === 200) {
            const data = await response.json();
            console.log(data, 'data');
            return data;
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
    } catch (error) {
        throw new Error(`Error in editTaskApi: ${error.message}`);
    }
};