import React from 'react'
import { numberWithCommas, roundingNumber } from '@/common/function'
import useApr from '@/hooks/useApr'
import Loading from '../Loading'
import { ContentInfo, EstimateRewardContainer, InfoContainer, SubText, Text, TextContainer, Title } from './styles'

const EstimateReward = () => {
  const { isLoadingApr, apr } = useApr()
  return (
    <EstimateRewardContainer>
      <Title>ESTIMATE REWARDS</Title>
      <InfoContainer>
        {isLoadingApr ? (
          <Loading width={70} height={70} />
        ) : (
          <ContentInfo>
            <TextContainer>
              <Text>{numberWithCommas(roundingNumber(apr, 2))}%</Text>
              <SubText>APR</SubText>
            </TextContainer>
          </ContentInfo>
        )}
      </InfoContainer>
    </EstimateRewardContainer>
  )
}

export default EstimateReward
