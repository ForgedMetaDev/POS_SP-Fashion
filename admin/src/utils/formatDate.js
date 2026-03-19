import dayjs from 'dayjs'

export const formatDate = (date) => dayjs(date).format('DD MMM YYYY')

export const formatDateTime = (date) => dayjs(date).format('DD MMM YYYY, hh:mm A')
