/*
 * This file is part of KubeSphere Console.
 * Copyright (C) 2019 The KubeSphere Console Authors.
 *
 * KubeSphere Console is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * KubeSphere Console is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with KubeSphere Console.  If not, see <https://www.gnu.org/licenses/>.
 */

import React, { Component } from 'react'
import { SimpleArea as Chart } from 'components/Charts'
import { formatDuration } from 'utils'
import { getAreaChartOps } from 'utils/monitoring'

export default class Monitoring extends Component {
  state = {
    metrics: [],
  }

  componentDidMount() {
    this.fetchMetrics()
  }

  fetchMetrics = async params => {
    const { query, duration } = this.props.detail || {}
    const seconds = formatDuration(duration)
    const end = Math.floor(Date.now() / 1000)
    const start = end - seconds
    const result = await this.props.store.fetchMetric({
      expr: query,
      end,
      start,
      step: '30s',
      ...params,
    })
    this.setState({ metrics: result })
  }

  render() {
    const { metrics } = this.state
    const options = getAreaChartOps({
      title: t('Alerting Monitoring'),
      data: metrics,
      legend: metrics.map(item => item.metric.node || item.metric.workload),
    })
    return <Chart {...options} />
  }
}
