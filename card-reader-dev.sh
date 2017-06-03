#!/bin/bash

devline=$(dmesg | grep RFID | grep hidraw)

if [[ -z "$devline" ]]; then
  echo 'Card reader not found'
  exit 1
fi

devicepath=$([[ $devline =~ hidraw[0-9] ]] && echo /dev/$BASH_REMATCH)

# sudo chmod 777 $devicepath

echo $devicepath
