/**
 * This function generates  a steam of random time series for
 * a given time interval with given precession,standard deviation, etc....
 */
import { generateRandomNumbers } from './random-sd';
import { getUnixTime,addMilliseconds,parseISO,getTime } from 'date-fns';
import { Observable,interval } from 'rxjs';

//semelar to generate time sereis but outputs a stream and currently it is cold
//as it uses generateRandomMumbers which is gives a static array not a stream
/**
 *
 * @param from
 * @param to
 * @param precession - in milliseconds
 * @param numberOfSamples
 * @param sd
 * @param rate - rate at whcih it should stream the samples
 * @return {*}
 */
export const streamTimeSeries = ({
    from,
    to,
    precession, // in milliseconds,
    numberOfSamples,
    sd,
    rate // rate at whcih it should stream the samples
  }) => {

  const milliSecondsFrom = getTime(parseISO(from));
  const milliSecondsTo = getTime(parseISO(to));
  const duration = milliSecondsTo - milliSecondsFrom;
  const __numberOfSamples = numberOfSamples
    || duration/precession
    || 1000;

  const timeArray = new Array(Math.floor(__numberOfSamples))
    .fill(1)
    .map((i,index) =>{
      return addMilliseconds(parseISO(from),index*precession);
  });

  const randomNumbers = generateRandomNumbers({
    sd,
    length: timeArray.length
  });

  return timeArray.forEach((time,index)=>{
    return new Observable((observer)=> {

      setTimeout(()=>{
        observer.next([time,randomNumbers[index]]);
        if(index === timeArray.length -1) observer.complete([]);

      },rate/0.001);

    })
  });
};
