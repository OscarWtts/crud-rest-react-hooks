import axios from 'axios';

export class FiscaliaService {
    baseUrl = "http://localhost:8888/api/";

    getAll() {
        return axios.get(this.baseUrl + "all").then(res => res.data);
    }

    save(fiscalia) {
        return axios.post(this.baseUrl + "save", fiscalia).then(res => res.data);
    }

    delete(id) {
        return axios.get(this.baseUrl + "delete/" + id).then(res => res.data);
    }
}