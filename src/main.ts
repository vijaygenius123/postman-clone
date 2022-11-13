import "bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css'
import axios, {AxiosResponse, AxiosResponseHeaders} from 'axios'

const form = document.querySelector<HTMLFormElement>('[data-form]')
const queryParamsContainer = document.querySelector<HTMLDivElement>('[data-query-params]')
const requestHeadersContainer = document.querySelector<HTMLDivElement>('[data-request-headers]')
const keyValueTemplate = document.querySelector<HTMLTemplateElement>('[data-key-value-template]')
const queryParamAddBtn = document.querySelector<HTMLButtonElement>('[data-add-query-param-btn]')
const requestHeaderAddBtn = document.querySelector<HTMLButtonElement>('[data-add-header-btn]')
const responseHeadersContainer = document.querySelector<HTMLDivElement>('[data-response-headers]')
queryParamsContainer?.append(createKeyValuePair('results', 10))

queryParamsContainer?.append(createKeyValuePair())
requestHeadersContainer?.append(createKeyValuePair())

queryParamAddBtn?.addEventListener('click',
    () => queryParamsContainer?.append(createKeyValuePair()))
requestHeaderAddBtn?.addEventListener('click',
    () => requestHeadersContainer?.append(createKeyValuePair()))

form?.addEventListener('submit', async (evt) => {
    evt.preventDefault()
    const response = await axios({
        url: document.querySelector<HTMLInputElement>('[data-url]')?.value,
        method: document.querySelector<HTMLInputElement>('[data-method]')?.value,
        params: keyValueParisToObject(queryParamsContainer),
        headers: keyValueParisToObject(requestHeadersContainer),
    })
    const {headers} = response
    updateResponseHeaders(headers)
    updateResponseDetails(response)
    console.log(response)
})

function updateResponseDetails(resp: AxiosResponse) {
    // @ts-ignore
    document.querySelector<HTMLSpanElement>('[data-status-code]').textContent = resp.status
}

function updateResponseHeaders(headers: AxiosResponseHeaders | Partial<Record<string, string>>) {
    // @ts-ignore
    responseHeadersContainer.innerHTML = ''
    Object.entries(headers).forEach(([key, value]) => {
        const keyElement = document.createElement('div'),
            valueElement = document.createElement('div')
        keyElement.textContent = key
        valueElement.textContent = value || ''
        responseHeadersContainer?.append(keyElement)
        responseHeadersContainer?.append(valueElement)

    })

}

function createKeyValuePair(key: string = "", value?: number | string): Node {

    const element = keyValueTemplate?.content.cloneNode(true)

    // @ts-ignore
    element.querySelector<HTMLButtonElement>('[data-remove-btn]').addEventListener('click', (e: any) => {
        e.target.closest('[data-key-value-pair]').remove()
    })
    // @ts-ignore
    element.querySelector<HTMLInputElement>('[data-key]').value = key

    if (value) {
        // @ts-ignore
        element.querySelector<HTMLInputElement>('[data-value]').value = value
    }
    // @ts-ignore
    return element
}

function keyValueParisToObject(container: HTMLDivElement | null) {
    const pairs = container?.querySelectorAll('[data-key-value-pair]')
    // @ts-ignore
    return [...pairs].reduce((data, pair) => {
        const key = pair.querySelector('[data-key]')?.value,
            value = pair.querySelector('[data-value]')?.value
        if (key === '') return data
        return {...data, [key]: value}
    }, {})
}
